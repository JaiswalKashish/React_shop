const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the StreetBite API!"
    });
});

// Test database connection
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            console.error("Database query failed:", err.message);

            return res.status(500).json({
                success: false,
                message: "Database query failed"
            });
        }

        res.json({
            success: true,
            message: "StreetBite database is working!",
            result: results[0].result
        });
    });
});
// Get all food items
app.get("/api/foods", (req, res) => {
    const sql = "SELECT * FROM foods ORDER BY id";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching foods:", err.message);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch food items"
            });
        }

        res.json({
            success: true,
            count: results.length,
            foods: results
        });
    });
});
// Place a customer order
app.post("/api/orders", (req, res) => {
    const { customer_name, phone, address, items } = req.body;

    // Validate customer details
    if (
        !customer_name ||
        !phone ||
        !address ||
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide customer details and at least one food item."
        });
    }

    // Validate each cart item
    for (const item of items) {
        if (
            !Number.isInteger(Number(item.food_id)) ||
            Number(item.food_id) <= 0 ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid food item or quantity."
            });
        }
    }

    // Get prices from the database instead of trusting frontend prices
    const foodIds = [...new Set(items.map(item => Number(item.food_id)))];

    const placeholders = foodIds.map(() => "?").join(",");

    db.query(
        `SELECT id, name, price FROM foods WHERE id IN (${placeholders})`,
        foodIds,
        (foodError, foods) => {
            if (foodError) {
                console.error("Error checking food items:", foodError.message);

                return res.status(500).json({
                    success: false,
                    message: "Unable to verify food items."
                });
            }

            if (foods.length !== foodIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more food items do not exist."
                });
            }

            const foodMap = new Map(
                foods.map(food => [Number(food.id), food])
            );

            let totalAmount = 0;

            const orderItems = [];

            for (const item of items) {
                const food = foodMap.get(Number(item.food_id));
                const quantity = Number(item.quantity);
                const price = Number(food.price);

                if (
                    !Number.isFinite(price) ||
                    price < 0 ||
                    quantity > 1000
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid price or quantity."
                    });
                }

                totalAmount += price * quantity;

                orderItems.push([
                    Number(item.food_id),
                    quantity,
                    price
                ]);
            }

            // Save the order and its items together
            db.beginTransaction((transactionError) => {
                if (transactionError) {
                    console.error(
                        "Unable to start transaction:",
                        transactionError.message
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Unable to place your order."
                    });
                }

                const orderSql = `
                    INSERT INTO orders
                    (customer_name, phone, address, total_amount, status)
                    VALUES (?, ?, ?, ?, 'Pending')
                `;

                db.query(
                    orderSql,
                    [
                        String(customer_name).trim(),
                        String(phone).trim(),
                        String(address).trim(),
                        totalAmount
                    ],
                    (orderError, orderResult) => {
                        if (orderError) {
                            return db.rollback(() => {
                                console.error(
                                    "Error saving order:",
                                    orderError.message
                                );

                                res.status(500).json({
                                    success: false,
                                    message: "Unable to save your order."
                                });
                            });
                        }

                        const orderId = orderResult.insertId;

                        const itemValues = orderItems.map(
                            ([foodId, quantity, price]) => [
                                orderId,
                                foodId,
                                quantity,
                                price
                            ]
                        );

                        const itemSql = `
                            INSERT INTO order_items
                            (order_id, food_id, quantity, price)
                            VALUES ?
                        `;

                        db.query(
                            itemSql,
                            [itemValues],
                            (itemsError) => {
                                if (itemsError) {
                                    return db.rollback(() => {
                                        console.error(
                                            "Error saving order items:",
                                            itemsError.message
                                        );

                                        res.status(500).json({
                                            success: false,
                                            message: "Unable to save order items."
                                        });
                                    });
                                }

                                db.commit((commitError) => {
                                    if (commitError) {
                                        return db.rollback(() => {
                                            console.error(
                                                "Error completing order:",
                                                commitError.message
                                            );

                                            res.status(500).json({
                                                success: false,
                                                message: "Unable to complete your order."
                                            });
                                        });
                                    }

                                    res.status(201).json({
                                        success: true,
                                        message: "Your order has been placed successfully!",
                                        order_id: orderId,
                                        total_amount: totalAmount,
                                        status: "Pending"
                                    });
                                });
                            }
                        );
                    }
                );
            });
        }
    );
});
// Get all orders for the admin dashboard
app.get("/api/orders", verifyAdmin, (req, res) => {
    const sql = `
        SELECT
            o.id,
            o.customer_name,
            o.phone,
            o.address,
            o.total_amount,
            o.status,
            o.created_at,
            oi.food_id,
            oi.quantity,
            oi.price,
            f.name AS food_name
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN foods f ON oi.food_id = f.id
        ORDER BY o.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err.message);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch orders."
            });
        }

        const ordersMap = new Map();

        results.forEach((row) => {
            if (!ordersMap.has(row.id)) {
                ordersMap.set(row.id, {
                    id: row.id,
                    customer_name: row.customer_name,
                    phone: row.phone,
                    address: row.address,
                    total_amount: Number(row.total_amount),
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                });
            }

            if (row.food_id !== null) {
                ordersMap.get(row.id).items.push({
                    food_id: row.food_id,
                    food_name: row.food_name,
                    quantity: row.quantity,
                    price: Number(row.price)
                });
            }
        });

        res.json({
            success: true,
            orders: Array.from(ordersMap.values())
        });
    });
});
// Update order status
app.put("/api/orders/:id/status", verifyAdmin, (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID"
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status"
    });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
    (error, result) => {
      if (error) {
        console.error("Error updating order status:", error.message);
        return res.status(500).json({
          success: false,
          message: "Failed to update order status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      res.json({
        success: true,
        message: "Order status updated successfully"
      });
    }
  );
});
// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUsername || !adminPassword || !jwtSecret) {
      console.error("Admin authentication environment variables are missing.");

      return res.status(500).json({
        success: false,
        message: "Admin login is not configured.",
      });
    }

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      { username: adminUsername, role: "admin" },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});
// Middleware to verify admin authentication
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please log in as admin.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 StreetBite backend running on http://localhost:${PORT}`);
});

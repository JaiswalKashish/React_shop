const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection failed:", err.message);
        return;
    }

    console.log("✅ Connected to the StreetBite database!");
});

// Add the expanded street-food menu once without duplicating existing dishes.
function seedAdditionalFoods(index = 0) {
    const foods = [
        ["Dahi Puri", 80, "/images/panipuri.jpeg"],
        ["Bhel Puri", 70, "/images/chat.jpg"],
        ["Aloo Tikki Chaat", 90, "/images/chat.jpg"],
        ["Masala Samosa", 40, "/images/samosa.jpg"],
        ["Vada Pav", 65, "/images/vada-pav.jpg"],
        ["Paneer Burger", 120, "/images/paneer-burger.jpg"],
        ["Corn and Cheese Pizza", 180, "/images/corn-cheese-pizza.jpg"],
        ["Pav Bhaji", 140, "/images/pav-bhaji.jpg"],
        ["Tandoori Paneer Pizza", 220, "/images/tandoori-paneer-pizza.jpg"],
        ["Paneer Tikka Burger", 160, "/images/paneer-tikka-burger.jpg"],
        ["Masala Dosa", 130, "/images/masala-dosa.jpg"],
        ["Dabeli", 75, "/images/dabeli.jpg"]
    ];

    if (index >= foods.length) {
        updateStreetFoodImages();
        return;
    }

    const [name, price, image] = foods[index];

    db.query(
        `INSERT INTO foods (name, price, image)
         SELECT ?, ?, ? FROM DUAL
         WHERE NOT EXISTS (SELECT 1 FROM foods WHERE name = ?)`,
        [name, price, image, name],
        (seedError) => {
            if (seedError) {
                console.error("Unable to add the expanded menu:", seedError.message);
                return;
            }

            seedAdditionalFoods(index + 1);
        }
    );
}

// Refresh the two existing dishes that had generic placeholder photos.
function updateStreetFoodImages(index = 0) {
    const images = [
        ["Aloo Tikki Chaat", "/images/aloo-tikki-chaat.jpg"],
        ["Masala Samosa", "/images/masala-samosa.jpg"]
    ];

    if (index >= images.length) return;

    const [name, image] = images[index];

    db.query(
        "UPDATE foods SET image = ? WHERE name = ?",
        [image, name],
        (updateError) => {
            if (updateError) {
                console.error("Unable to update a menu photo:", updateError.message);
                return;
            }

            updateStreetFoodImages(index + 1);
        }
    );
}

seedAdditionalFoods();

module.exports = db;

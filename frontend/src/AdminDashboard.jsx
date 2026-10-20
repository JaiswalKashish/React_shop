import { useEffect, useMemo, useState } from "react";
import API_URL from "./api.js";
// Handle expired or invalid admin sessions
function handleSessionExpiry() {
  localStorage.removeItem("adminToken");
  window.location.replace("/admin-login");
}

const ORDERS_API_URL = `${API_URL}/api/orders`;

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch orders from the backend
  async function fetchOrders(showRefreshing = false) {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(ORDERS_API_URL, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  },
});
      const data = await response.json();

// Automatically log out if the token is invalid or expired
if (response.status === 401 || response.status === 403) {
  handleSessionExpiry();
  return;
}

if (!response.ok || !data.success) {
  throw new Error(data.message || "Unable to load orders.");
}

      setOrders(data.orders);
    } catch (err) {
      setError(
        err.message || "Could not connect to the StreetBite backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Update order status in the database
  async function updateOrderStatus(orderId, newStatus) {
    const previousOrder = orders.find(
      (order) => order.id === orderId
    );

    if (!previousOrder || previousOrder.status === newStatus) {
      return;
    }

    setUpdatingOrderId(orderId);
    setError("");

    try {
      const response = await fetch(`${ORDERS_API_URL}/${orderId}/status`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  },
  body: JSON.stringify({ status: newStatus }),
});

     const data = await response.json();

// Automatically log out if the token is invalid or expired
if (response.status === 401 || response.status === 403) {
  handleSessionExpiry();
  return;
}

if (!response.ok || !data.success) {
  throw new Error(
    data.message || "Failed to update order status."
  );
}
      // Update the displayed order after the backend confirms success
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      setError(
        err.message || "Could not update the order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // Load orders when the dashboard opens
  useEffect(() => {
    fetchOrders();
  }, []);

  // Search and filter orders
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        String(order.id).includes(term) ||
        String(order.customer_name || "")
          .toLowerCase()
          .includes(term) ||
        String(order.phone || "").includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Calculate dashboard statistics
  const totalSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <a href="/" className="admin-brand">
          <span className="admin-brand-icon">ðŸ”</span>

          <span>
            <strong>StreetBite</strong>
            <small>ADMIN PANEL</small>
          </span>
        </a>

        <div className="admin-header-actions">
  <button
    className="admin-logout-button"
    onClick={() => {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login";
    }}
  >
    Logout â†ª
  </button>

  <a href="/" className="admin-home-link">
    â† Back to Website
  </a>
</div>
      </header>

      <main className="admin-main">
        {/* Dashboard heading */}
        <div className="admin-title-row">
          <div>
            <p className="admin-eyebrow">
              MANAGE YOUR BUSINESS
            </p>

            <h1>Order Dashboard</h1>

            <p className="admin-subtitle">
              Track customer orders and monitor your sales.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            onClick={() => fetchOrders(true)}
            disabled={refreshing || loading}
          >
            {refreshing ? "Refreshing..." : "â†» Refresh Orders"}
          </button>
        </div>

        {/* Dashboard statistics */}
        <section className="admin-stats">
          <article className="admin-stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
            <small>All recorded orders</small>
          </article>

          <article className="admin-stat-card">
            <span>Total Sales</span>
            <strong>
              â‚¹{totalSales.toLocaleString("en-IN")}
            </strong>
            <small>Excluding cancelled orders</small>
          </article>

          <article className="admin-stat-card">
            <span>Pending Orders</span>
            <strong>{pendingOrders}</strong>
            <small>Awaiting confirmation</small>
          </article>

          <article className="admin-stat-card">
            <span>Delivered Orders</span>
            <strong>{deliveredOrders}</strong>
            <small>Successfully delivered</small>
          </article>
        </section>

        {/* Orders section */}
        <section className="admin-orders-section">
          <div className="admin-orders-heading">
            <div>
              <h2>Customer Orders</h2>

              <p>
                Review customer details and purchased items.
              </p>
            </div>

            <span className="admin-order-count">
              {filteredOrders.length} orders
            </span>
          </div>

          {/* Search and status filters */}
          <div className="admin-filters">
            <input
              type="search"
              placeholder="Search by order ID, name, or phone..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search orders"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter orders by status"
            >
              <option value="All">All statuses</option>

              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="admin-message admin-error">
              <p>{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <p className="admin-message">
              Loading customer orders...
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="admin-message">
              No matching orders found.
            </p>
          ) : (
            /* Orders table */
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      {/* Order ID */}
                      <td>
                        <strong>#{order.id}</strong>
                      </td>

                      {/* Customer details */}
                      <td>
                        <strong>{order.customer_name}</strong>
                        <small>{order.phone}</small>
                        <small>{order.address}</small>
                      </td>

                      {/* Ordered items */}
                      <td>
                        {(order.items || []).map(
                          (item, index) => (
                            <div
                              key={`${item.food_id}-${index}`}
                            >
                              {item.food_name} Ã— {item.quantity}
                            </div>
                          )
                        )}
                      </td>

                      {/* Order total */}
                      <td>
                        <strong>
                          â‚¹
                          {Number(
                            order.total_amount || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      {/* Editable order status */}
                      <td>
                        <select
                          value={order.status}
                          disabled={
                            updatingOrderId === order.id
                          }
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value
                            )
                          }
                          className={`admin-status-select status-${String(
                            order.status || "Pending"
                          )
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                          aria-label={`Update status for order ${order.id}`}
                        >
                          {STATUSES.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingOrderId === order.id && (
                          <small className="admin-updating">
                            Saving...
                          </small>
                        )}
                      </td>

                      {/* Order date */}
                      <td>
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString("en-IN")
                          : "â€”"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

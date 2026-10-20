import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./api.js";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      // Store the token for authenticated API requests
      localStorage.setItem("adminToken", data.token);

      // Navigate to the admin dashboard
      navigate("/admin");
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <a href="/" className="admin-login-brand">
          <span>ðŸ”</span>
          <div>
            <h1>StreetBite</h1>
            <p>ADMIN PANEL</p>
          </div>
        </a>

        <h2>Welcome Back!</h2>

        <p className="admin-login-subtitle">
          Sign in to manage your customer orders.
        </p>

        <form onSubmit={handleLogin}>
          <div className="admin-login-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In â†’"}
          </button>
        </form>

        <a href="/" className="admin-login-back">
          â† Back to StreetBite
        </a>
      </div>
    </div>
  );
}

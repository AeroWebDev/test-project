"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaLock, FaSync } from "react-icons/fa";
import AdminLayout from "@/src/components/AdminLayout";

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: "success" | "error" | "warning";
}

export default function Logs() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "success" | "error" | "warning">("all");
  const [refreshing, setRefreshing] = useState(false);

  // Restore session from sessionStorage on load
  useEffect(() => {
    sessionStorage.removeItem("admin_aero_pass"); // Clean up legacy saved passwords
    const isAuth = sessionStorage.getItem("admin_aero_auth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
      fetchLogs();
    }
  }, []);

  async function authenticateAndFetchLogs(pass: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/aero/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, isDashboard: true }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed");
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_aero_auth");
        sessionStorage.removeItem("admin_aero_name");
      } else {
        setIsAuthenticated(true);
        setPassword(""); // Clear password from memory
        sessionStorage.setItem("admin_aero_auth", "true");
        sessionStorage.setItem("admin_aero_name", data.adminName || "Aero Administrator");
        fetchLogs();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLogs() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/logs");

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      } else {
        console.error("Failed to fetch logs:", res.status);
        setLogs([]);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
    } finally {
      setRefreshing(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("admin_aero_auth");
    sessionStorage.removeItem("admin_aero_name");
    sessionStorage.removeItem("admin_aero_stats");
    sessionStorage.removeItem("admin_aero_pass");
  }

  const filteredLogs = filter === "all" ? logs : logs.filter((log) => log.status === filter);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <Link href="/admin/aero" className="admin-back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <div className="admin-login-header">
            <FaLock className="admin-lock-icon" />
            <h1>Authenticate</h1>
            <p>System Logs</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); authenticateAndFetchLogs(password); }} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                disabled={loading}
              />
            </div>

            {error && <div className="admin-error">{error}</div>}

            <button type="submit" className="admin-btn-primary" disabled={loading}>
              {loading ? "Authenticating..." : "Access Logs"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      onLogout={handleLogout}
      adminName="Administrator"
      title="System Logs"
      subtitle="Track all activities and system events"
    >
      {/* Filter Options */}
      <div className="admin-filter-bar">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Logs
          </button>
          <button
            className={`filter-btn ${filter === "success" ? "active" : ""}`}
            onClick={() => setFilter("success")}
          >
            ✓ Success
          </button>
          <button
            className={`filter-btn ${filter === "warning" ? "active" : ""}`}
            onClick={() => setFilter("warning")}
          >
            ⚠ Warning
          </button>
          <button
            className={`filter-btn ${filter === "error" ? "active" : ""}`}
            onClick={() => setFilter("error")}
          >
            ✕ Error
          </button>
          <button
            onClick={() => fetchLogs()}
            className="admin-btn-primary"
            disabled={refreshing}
            style={{ marginLeft: "auto" }}
          >
            <FaSync /> {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="admin-table-card">
        <h2>Activity Logs ({filteredLogs.length})</h2>
        {filteredLogs.length === 0 ? (
          <p className="empty-state">No logs found</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="log-timestamp">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="log-action">
                      <code>{log.action}</code>
                    </td>
                    <td>{log.user}</td>
                    <td className="log-details">{log.details}</td>
                    <td>
                      <span className={`log-status log-status-${log.status}`}>
                        {log.status === "success" && "✓ Success"}
                        {log.status === "warning" && "⚠ Warning"}
                        {log.status === "error" && "✕ Error"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="admin-info-box">
        <h3>📝 About Logs</h3>
        <p>
          System logs track all important activities in the dashboard including game creation, code updates, and automated tasks.
          Logs are stored for audit purposes and help identify any issues with the system.
        </p>
      </div>
    </AdminLayout>
  );
}

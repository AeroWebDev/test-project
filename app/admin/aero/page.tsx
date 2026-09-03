"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLock, FaGamepad, FaKey, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";
import AdminLayout from "@/src/components/AdminLayout";

type DashboardStats = {
  totalGames?: number;
  totalCodes?: number;
  activeCodes?: number;
  expiredCodes?: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // Restore session from sessionStorage on load
  useEffect(() => {
    sessionStorage.removeItem("admin_aero_pass"); // Clean up any legacy saved passwords
    const isAuth = sessionStorage.getItem("admin_aero_auth") === "true";
    const savedName = sessionStorage.getItem("admin_aero_name");
    const savedStats = sessionStorage.getItem("admin_aero_stats");

    if (isAuth) {
      setIsAuthenticated(true);
      if (savedName) setAdminName(savedName);
      if (savedStats) {
        try {
          setDashboardStats(JSON.parse(savedStats));
        } catch {
          // stats will be re-fetched on refresh
        }
      }
    }
  }, []);

  async function loginWithPassword(pass: string) {
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
        setError(data.error || "Login failed");
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_aero_auth");
        sessionStorage.removeItem("admin_aero_name");
        sessionStorage.removeItem("admin_aero_stats");
      } else {
        setIsAuthenticated(true);
        setAdminName(data.adminName);
        setDashboardStats(data.dashboardStats);
        setPassword(""); // Clear password from memory

        // Save session state without saving password
        sessionStorage.setItem("admin_aero_auth", "true");
        sessionStorage.setItem("admin_aero_name", data.adminName);
        if (data.dashboardStats) {
          sessionStorage.setItem("admin_aero_stats", JSON.stringify(data.dashboardStats));
        }
      }
    } catch {
      setError("Network or server connection error");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    loginWithPassword(password);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("admin_aero_auth");
    sessionStorage.removeItem("admin_aero_name");
    sessionStorage.removeItem("admin_aero_stats");
    sessionStorage.removeItem("admin_aero_pass");
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <FaLock className="admin-lock-icon" />
            <h1>Admin Dashboard</h1>
            <p>RoBcodes Control Center</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
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
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      onLogout={handleLogout}
      adminName={adminName}
      title="Dashboard"
      subtitle={new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    >
      {/* Stats Section */}
      {dashboardStats && (
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon games-icon">
              <FaGamepad />
            </div>
            <div className="stat-content">
              <h3>Total Games</h3>
              <p className="stat-number">{dashboardStats.totalGames || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon codes-icon">
              <FaKey />
            </div>
            <div className="stat-content">
              <h3>Total Codes</h3>
              <p className="stat-number">{dashboardStats.totalCodes || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active-icon">
              <FaCheck />
            </div>
            <div className="stat-content">
              <h3>Active Codes</h3>
              <p className="stat-number">{dashboardStats.activeCodes || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon expired-icon">
              <FaTimes />
            </div>
            <div className="stat-content">
              <h3>Expired Codes</h3>
              <p className="stat-number">{dashboardStats.expiredCodes || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="admin-nav-grid">
        <Link href="/admin/aero/games" className="admin-nav-card">
          <div className="nav-card-icon">
            <FaGamepad />
          </div>
          <div className="nav-card-content">
            <h3>Manage Games</h3>
            <p>Create, edit, and delete games</p>
          </div>
          <span className="nav-card-arrow">→</span>
        </Link>

        <Link href="/admin/aero/codes" className="admin-nav-card">
          <div className="nav-card-icon">
            <FaKey />
          </div>
          <div className="nav-card-content">
            <h3>Manage Codes</h3>
            <p>Add, update, and remove promo codes</p>
          </div>
          <span className="nav-card-arrow">→</span>
        </Link>

        <Link href="/admin/aero/logs" className="admin-nav-card">
          <div className="nav-card-icon">
            <FaFileAlt />
          </div>
          <div className="nav-card-content">
            <h3>View Logs</h3>
            <p>System and activity logs</p>
          </div>
          <span className="nav-card-arrow">→</span>
        </Link>
      </div>
    </AdminLayout>
  );
}

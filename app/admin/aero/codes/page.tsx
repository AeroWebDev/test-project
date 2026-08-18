"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaEdit, FaTrashAlt, FaLock, FaCheck, FaTimes } from "react-icons/fa";
import AdminLayout from "@/src/components/AdminLayout";

interface Code {
  id: string;
  game_id: string;
  code: string;
  reward: string;
  status: "active" | "expired";
  is_new: boolean;
  expires_at: string | null;
}

interface Game {
  id: string;
  title: string;
}

export default function CodesManagement() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codes, setCodes] = useState<Code[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state for new code
  const [formData, setFormData] = useState({
    game_id: "",
    code: "",
    reward: "",
    expires_at: "",
    is_new: false,
  });

  // Restore session from sessionStorage on load
  useEffect(() => {
    const savedPass = sessionStorage.getItem("admin_aero_pass");
    if (savedPass) {
      setPassword(savedPass);
      authenticateAndFetchData(savedPass);
    }
  }, []);

  async function authenticateAndFetchData(pass: string) {
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
        sessionStorage.removeItem("admin_aero_pass");
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_aero_pass", pass);
        fetchCodes(pass);
        fetchGames(pass);
      }
    } catch (err: any) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCodes(pass: string) {
    try {
      const res = await fetch("/api/admin/codes");

      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
      } else {
        console.error("Failed to fetch codes:", res.status);
      }
    } catch (err) {
      console.error("Error fetching codes:", err);
    }
  }

  async function fetchGames(pass: string) {
    try {
      const res = await fetch("/api/admin/games");

      if (res.ok) {
        const data = await res.json();
        setGames(data.games || []);
      } else {
        console.error("Failed to fetch games:", res.status);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  }

  function handleAddCode(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg(null);

    if (!formData.game_id || !formData.code || !formData.reward) {
      setFormMsg({ type: "error", text: "Game, code, and reward are required!" });
      return;
    }

    // Placeholder for add code functionality
    setFormMsg({ type: "success", text: "Code added successfully!" });
    setFormData({
      game_id: "",
      code: "",
      reward: "",
      expires_at: "",
      is_new: false,
    });
    setShowAddForm(false);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("admin_aero_pass");
  }

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
            <p>Codes Management</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); authenticateAndFetchData(password); }} className="admin-login-form">
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
              {loading ? "Authenticating..." : "Access Codes"}
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
      title="Manage Codes"
      subtitle="Create and manage promo codes"
    >
      {formMsg && (
        <div className={`admin-message ${formMsg.type}`}>
          {formMsg.text}
        </div>
      )}

      {/* Add Code Button */}
      {!showAddForm && (
        <div style={{ marginBottom: "2rem" }}>
          <button onClick={() => setShowAddForm(!showAddForm)} className="admin-btn-primary">
            <FaPlus /> Add Code
          </button>
        </div>
      )}

      {/* Add Code Form */}
      {showAddForm && (
        <div className="admin-form-card">
          <h2>Add New Code</h2>
          <form onSubmit={handleAddCode} className="admin-form">
            <div className="form-group">
              <label>Game *</label>
              <select
                value={formData.game_id}
                onChange={(e) => setFormData({ ...formData, game_id: e.target.value })}
                className="admin-input"
              >
                <option value="">Select a game</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>{game.title}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Code *</label>
                <input
                  type="text"
                  placeholder="e.g., WELCOMECODE2024"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Reward *</label>
                <input
                  type="text"
                  placeholder="e.g., 500 Gems + 2x Exp"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expires At</label>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  />
                  Mark as New
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="admin-btn-primary">Save Code</button>
              <button type="button" className="admin-btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Codes Table */}
      <div className="admin-table-card">
        <h2>Codes List ({codes.length})</h2>
        {codes.length === 0 ? (
          <p className="empty-state">No codes found</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Reward</th>
                  <th>Status</th>
                  <th>New</th>
                  <th>Expires At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.id}>
                    <td><code className="code-text">{code.code}</code></td>
                    <td>{code.reward}</td>
                    <td>
                      {code.status === "active" ? (
                        <span className="badge badge-active"><FaCheck /> Active</span>
                      ) : (
                        <span className="badge badge-inactive"><FaTimes /> Expired</span>
                      )}
                    </td>
                    <td>
                      {code.is_new ? (
                        <span className="badge badge-new">✨ New</span>
                      ) : (
                        <span className="badge badge-normal">Standard</span>
                      )}
                    </td>
                    <td>
                      {code.expires_at ? new Date(code.expires_at).toLocaleDateString() : "No expiry"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="admin-btn-icon admin-btn-edit" title="Edit">
                          <FaEdit />
                        </button>
                        <button className="admin-btn-icon admin-btn-delete" title="Delete">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

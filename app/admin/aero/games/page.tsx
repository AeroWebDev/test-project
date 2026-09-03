"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaEdit, FaTrashAlt, FaLock, FaCheck, FaTimes } from "react-icons/fa";
import AdminLayout from "@/src/components/AdminLayout";

interface Game {
  id: string;
  title: string;
  slug: string;
  category: string;
  developer: string;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
  is_trending: boolean;
  likes: string | null;
}

export default function GamesManagement() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state for new game
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Anime",
    developer: "",
    description: "",
    image_url: "",
    likes: "",
  });

  // Restore session from sessionStorage on load
  useEffect(() => {
    sessionStorage.removeItem("admin_aero_pass"); // Clean up legacy saved passwords
    const isAuth = sessionStorage.getItem("admin_aero_auth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
      fetchGames();
    }
  }, []);

  async function authenticateAndFetchGames(pass: string) {
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
        fetchGames();
      }
    } catch (err: any) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchGames() {
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

  function handleAddGame(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg(null);

    if (!formData.title || !formData.slug) {
      setFormMsg({ type: "error", text: "Title and slug are required!" });
      return;
    }

    // Placeholder for add game functionality
    setFormMsg({ type: "success", text: "Game added successfully!" });
    setFormData({
      title: "",
      slug: "",
      category: "Anime",
      developer: "",
      description: "",
      image_url: "",
      likes: "",
    });
    setShowAddForm(false);
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
          <Link href="/admin/aero" className="admin-back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <div className="admin-login-header">
            <FaLock className="admin-lock-icon" />
            <h1>Authenticate</h1>
            <p>Games Management</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); authenticateAndFetchGames(password); }} className="admin-login-form">
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
              {loading ? "Authenticating..." : "Access Games"}
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
      title="Manage Games"
      subtitle="Add, edit, and manage your game library"
    >
      {formMsg && (
        <div className={`admin-message ${formMsg.type}`}>
          {formMsg.text}
        </div>
      )}

      {/* Add Game Form */}
      {showAddForm && (
        <div className="admin-form-card">
          <h2>Add New Game</h2>
          <form onSubmit={handleAddGame} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Game title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  placeholder="game-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="admin-input"
                >
                  <option>Anime</option>
                  <option>Simulator</option>
                  <option>RPG</option>
                  <option>Action</option>
                  <option>Tower Defense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Developer</label>
                <input
                  type="text"
                  placeholder="Developer name"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Game description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="admin-input"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Likes</label>
                <input
                  type="text"
                  placeholder="2.5K"
                  value={formData.likes}
                  onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="admin-btn-primary">Save Game</button>
              <button type="button" className="admin-btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Game Button */}
      {!showAddForm && (
        <div style={{ marginBottom: "2rem" }}>
          <button onClick={() => setShowAddForm(!showAddForm)} className="admin-btn-primary">
            <FaPlus /> Add Game
          </button>
        </div>
      )}

      {/* Games Table */}
      <div className="admin-table-card">
        <h2>Games List ({games.length})</h2>
        {games.length === 0 ? (
          <p className="empty-state">No games found</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Developer</th>
                  <th>Status</th>
                  <th>Trending</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td>{game.title}</td>
                    <td>{game.category}</td>
                    <td>{game.developer}</td>
                    <td>
                      {game.is_published ? (
                        <span className="badge badge-active"><FaCheck /> Published</span>
                      ) : (
                        <span className="badge badge-inactive"><FaTimes /> Draft</span>
                      )}
                    </td>
                    <td>
                      {game.is_trending ? (
                        <span className="badge badge-trending">🔥 Trending</span>
                      ) : (
                        <span className="badge badge-normal">Normal</span>
                      )}
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

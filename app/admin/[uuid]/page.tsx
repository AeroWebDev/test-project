"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaLock, FaKey, FaPlus, FaCheck, FaTrashAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

export default function GameAdminPage() {
  const params = useParams();
  const accessUuid = params?.uuid as string;

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adminName, setAdminName] = useState("");
  const [game, setGame] = useState<any>(null);
  const [codes, setCodes] = useState<any[]>([]);

  // New Code Form State
  const [newCode, setNewCode] = useState("");
  const [newReward, setNewReward] = useState("");
  const [newExpiresAt, setNewExpiresAt] = useState("");
  const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Restore session from sessionStorage on load
  useEffect(() => {
    sessionStorage.removeItem(`admin_pass_${accessUuid}`); // Clean up legacy saved passwords
    const isAuth = sessionStorage.getItem(`admin_uuid_auth_${accessUuid}`) === "true";
    const savedName = sessionStorage.getItem(`admin_uuid_name_${accessUuid}`);
    const savedGame = sessionStorage.getItem(`admin_uuid_game_${accessUuid}`);
    const savedCodes = sessionStorage.getItem(`admin_uuid_codes_${accessUuid}`);

    if (isAuth) {
      setIsAuthenticated(true);
      if (savedName) setAdminName(savedName);
      if (savedGame) {
        try {
          setGame(JSON.parse(savedGame));
        } catch {
          // fallback
        }
      }
      if (savedCodes) {
        try {
          setCodes(JSON.parse(savedCodes));
        } catch {
          // fallback
        }
      }
    }
  }, [accessUuid]);

  async function loginWithPassword(pass: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessUuid, password: pass }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed");
        setIsAuthenticated(false);
        sessionStorage.removeItem(`admin_uuid_auth_${accessUuid}`);
        sessionStorage.removeItem(`admin_uuid_name_${accessUuid}`);
        sessionStorage.removeItem(`admin_uuid_game_${accessUuid}`);
        sessionStorage.removeItem(`admin_uuid_codes_${accessUuid}`);
      } else {
        setIsAuthenticated(true);
        setAdminName(data.adminName);
        setGame(data.game);
        setCodes(data.codes);

        // Store session state without saving password
        sessionStorage.setItem(`admin_uuid_auth_${accessUuid}`, "true");
        sessionStorage.setItem(`admin_uuid_name_${accessUuid}`, data.adminName);
        if (data.game) {
          sessionStorage.setItem(`admin_uuid_game_${accessUuid}`, JSON.stringify(data.game));
        }
        if (data.codes) {
          sessionStorage.setItem(`admin_uuid_codes_${accessUuid}`, JSON.stringify(data.codes));
        }
      }
    } catch (err: any) {
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
    sessionStorage.removeItem(`admin_uuid_auth_${accessUuid}`);
    sessionStorage.removeItem(`admin_uuid_name_${accessUuid}`);
    sessionStorage.removeItem(`admin_uuid_game_${accessUuid}`);
    sessionStorage.removeItem(`admin_uuid_codes_${accessUuid}`);
    sessionStorage.removeItem(`admin_pass_${accessUuid}`);
  }

  async function handleAddCode(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg(null);

    if (!newCode || !newReward) {
      setFormMsg({ type: "error", text: "Code and Reward description are required!" });
      return;
    }

    try {
      const res = await fetch("/api/admin/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessUuid,
          password,
          action: "ADD_CODE",
          codeData: {
            code: newCode,
            reward: newReward,
            expiresAt: newExpiresAt ? new Date(newExpiresAt).toISOString() : null,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormMsg({ type: "error", text: data.error || "Failed to add code" });
      } else {
        setFormMsg({ type: "success", text: `Code "${newCode.toUpperCase()}" added successfully!` });
        setCodes([data.code, ...codes]);
        setNewCode("");
        setNewReward("");
        setNewExpiresAt("");
      }
    } catch (err: any) {
      setFormMsg({ type: "error", text: "Failed to submit code" });
    }
  }

  async function handleToggleStatus(codeId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "expired" : "active";
    try {
      const res = await fetch("/api/admin/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessUuid,
          password,
          action: "TOGGLE_STATUS",
          codeData: { codeId, newStatus },
        }),
      });

      if (res.ok) {
        setCodes(codes.map((c) => (c.id === codeId ? { ...c, status: newStatus } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteCode(codeId: string) {
    if (!confirm("Are you sure you want to delete this code?")) return;

    try {
      const res = await fetch("/api/admin/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessUuid,
          password,
          action: "DELETE_CODE",
          codeData: { codeId },
        }),
      });

      if (res.ok) {
        setCodes(codes.filter((c) => c.id !== codeId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Render Login Form if unauthenticated
  if (!isAuthenticated) {
    return (
      <main className="main-content">
        <section className="content-page">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <FaLock />
            </div>
            <h1>Game Owner Portal</h1>
            <p className="lead">Enter your admin password to manage your game's redeem codes.</p>
          </div>

          <form onSubmit={handleLogin} className="contact-form" style={{ maxWidth: "450px", margin: "0 auto" }}>
            {error && (
              <div
                style={{
                  background: "var(--red-bg)",
                  border: "1px solid var(--red-border)",
                  color: "var(--red)",
                  padding: "10px 14px",
                  borderRadius: "var(--radius)",
                  fontSize: "0.88rem",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="adminPass">Admin Password</label>
              <input
                id="adminPass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
              />
            </div>

            <button type="submit" className="copy-btn submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  // Render Authenticated Admin Dashboard
  return (
    <main className="main-content">
      <section className="section-container" style={{ paddingTop: "2rem" }}>
        {/* Header */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "1.5rem 2rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: "700" }}>
              <FaShieldAlt style={{ marginRight: "6px" }} />
              GAME OWNER DASHBOARD
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "4px 0" }}>
              {game ? game.title : "Game Dashboard"}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", margin: 0 }}>
              Logged in as: <strong>{adminName}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="chip-btn"
            style={{ padding: "8px 16px" }}
          >
            Lock / Sign Out
          </button>
        </div>

        {/* Add New Code Form */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-xl)",
            padding: "1.75rem 2rem",
            marginBottom: "2.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaPlus style={{ color: "var(--accent)" }} /> Add New Promo Code
          </h2>

          {formMsg && (
            <div
              style={{
                background: formMsg.type === "success" ? "var(--green-bg)" : "var(--red-bg)",
                border: `1px solid ${formMsg.type === "success" ? "var(--green-border)" : "var(--red-border)"}`,
                color: formMsg.type === "success" ? "var(--green)" : "var(--red)",
                padding: "10px 14px",
                borderRadius: "var(--radius)",
                fontSize: "0.88rem",
                marginBottom: "1rem",
              }}
            >
              {formMsg.type === "success" ? "✅" : "⚠️"} {formMsg.text}
            </div>
          )}

          <form onSubmit={handleAddCode} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="codeText">Code String</label>
              <input
                id="codeText"
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. SUMMERBOOST2026"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rewardText">Reward Description</label>
              <input
                id="rewardText"
                type="text"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                placeholder="e.g. 2x EXP Boost for 30 Mins"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expireDate">Expiration Date (Optional)</label>
              <input
                id="expireDate"
                type="datetime-local"
                value={newExpiresAt}
                onChange={(e) => setNewExpiresAt(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="copy-btn" style={{ width: "100%", justifyContent: "center", height: "46px" }}>
                Publish Code
              </button>
            </div>
          </form>
        </div>

        {/* Existing Codes Management */}
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "1rem" }}>
            Existing Codes ({codes.length})
          </h2>

          <div className="codes-list">
            {codes.length === 0 ? (
              <div className="no-codes-box">No codes created yet. Use the form above to add your first code!</div>
            ) : (
              codes.map((c) => (
                <div key={c.id} className={`code-card ${c.status === "expired" ? "expired" : ""}`}>
                  <div className="code-card-info">
                    <div className="code-card-header">
                      <span className={`code-text ${c.status === "expired" ? "strikethrough" : ""}`}>
                        {c.code}
                      </span>
                      <span className={`badge ${c.status === "active" ? "badge-active" : "badge-expired"}`}>
                        {c.status.toUpperCase()}
                      </span>
                      {c.is_new && <span className="badge badge-new">NEW</span>}
                    </div>
                    <p className="code-reward">{c.reward}</p>
                    {c.expires_at && (
                      <div style={{ fontSize: "0.78rem", color: "var(--amber)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaCalendarAlt /> Expires: {new Date(c.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      className="chip-btn"
                      style={{ padding: "8px 14px" }}
                    >
                      {c.status === "active" ? "Mark Expired" : "Mark Active"}
                    </button>
                    <button
                      onClick={() => handleDeleteCode(c.id)}
                      className="chip-btn"
                      style={{ padding: "8px 14px", color: "var(--red)", borderColor: "var(--red-border)" }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

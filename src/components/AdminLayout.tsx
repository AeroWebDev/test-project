"use client";

import React, { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  adminName: string;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({
  children,
  onLogout,
  adminName,
  title,
  subtitle,
}: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={onLogout} adminName={adminName} />
      <main className="admin-main-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="header-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="header-badge">
            <span className="live-indicator">● Live</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-page-content">{children}</div>
      </main>
    </div>
  );
}

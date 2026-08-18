"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaDashcube,
  FaGamepad,
  FaKey,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface AdminSidebarProps {
  onLogout: () => void;
  adminName: string;
}

export default function AdminSidebar({ onLogout, adminName }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: FaDashcube, href: "/admin/aero" },
    { name: "Games", icon: FaGamepad, href: "/admin/aero/games" },
    { name: "Codes", icon: FaKey, href: "/admin/aero/codes" },
    { name: "Logs", icon: FaFileAlt, href: "/admin/aero/logs" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className={`sidebar-brand ${isCollapsed ? "hidden" : ""}`}>
          <h2>RoBcodes</h2>
          <p>Dashboard</p>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className={`sidebar-section-title ${isCollapsed ? "hidden" : ""}`}>
          NAVIGATION
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-menu-item ${isActive(item.href) ? "active" : ""}`}
                  title={item.name}
                >
                  <Icon className="menu-icon" />
                  <span className={`menu-label ${isCollapsed ? "hidden" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="sidebar-user">
        <div className={`user-profile ${isCollapsed ? "hidden" : ""}`}>
          <div className="user-avatar">
            {adminName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{adminName}</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
        <button
          className="sidebar-logout"
          onClick={onLogout}
          title="Logout"
        >
          <FaSignOutAlt />
          <span className={`logout-label ${isCollapsed ? "hidden" : ""}`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

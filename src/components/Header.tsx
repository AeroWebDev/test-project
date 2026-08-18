"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaDiscord,
} from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", exact: true },
    { href: "/games", label: "All Games", exact: false },
    { href: "/about", label: "About", exact: true },
    { href: "/contact", label: "Contact", exact: true },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <Link href="/" title="RoBcodes — Free Roblox Game Codes">
          <span className="dot"></span>
          <span className="logo-text">RoBcodes</span>
        </Link>
      </div>

      {/* Desktop nav — centered pill */}
      <nav className="nav" aria-label="Main navigation">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href, link.exact) ? "active" : ""}
                title={`Go to ${link.label}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social icons — desktop */}
      <div id="socialLinks" aria-label="Social media links">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF size={17} /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={17} /></a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord"><FaDiscord size={17} /></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><FaTwitter size={17} /></a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className={`hamburger ${mobileOpen ? "open" : ""}`}></span>
      </button>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="mobile-nav" onClick={() => setMobileOpen(false)}>
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href, link.exact) ? "active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-social">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord"><FaDiscord size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={20} /></a>
          </div>
        </div>
      )}
    </header>
  );
}

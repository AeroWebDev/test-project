import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Brand logo & Copyright */}
      <div className="footer-logo">
        <span className="dot"></span> RoBcodes
        <p>© {new Date().getFullYear()} RoBcodes. Daily working codes for Roblox games. All rights reserved.</p>
        <p className="footer-credit">
          Made by <a href="https://aeroteam.vercel.app/" target="_blank" rel="noopener noreferrer" title="Visit Aero Team website">Aero Team</a>
        </p>
      </div>

      {/* Navigation links for SEO */}
      <nav className="footer-nav" aria-label="Footer navigation">
        <ul>
          <li><Link href="/" title="Go to Home Page">Home</Link></li>
          <li><Link href="/games" title="Browse All Games">All Games Catalog</Link></li>
          <li><Link href="/about" title="Learn more about RoBcodes">About Us</Link></li>
          <li><Link href="/contact" title="Contact RoBcodes team">Contact Support</Link></li>
          <li><Link href="/privacy" title="Privacy Policy">Privacy Policy</Link></li>
          <li><Link href="/terms" title="Terms of Service">Terms of Service</Link></li>
        </ul>
      </nav>

      {/* Social Media */}
      <div className="footer-social" aria-label="Social media links">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebookF size={18} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram size={18} />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <FaDiscord size={18} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter size={18} />
        </a>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { useToast } from "@/src/components/Toast";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  message: "",
};

export default function ContactPage() {
  const { showToast } = useToast();

  const developerLinks = [
    { label: "Facebook", href: "https://facebook.com/robcodes.dev" },
    { label: "WhatsApp", href: "https://wa.me/15551234567?text=Hi%20RoBcodes%20team" },
  ];

  const supportLinks = [
    { label: "Facebook", href: "https://facebook.com/robcodes.support" },
    { label: "Discord Server", href: "https://discord.gg/robcodes" },
  ];

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSubmitted(true);
      setFormData(initialFormData);

      showToast("Message sent! Thank you for reaching out.");
    } catch (error) {
      console.error("Contact form error:", error);

      showToast(
        error instanceof Error
          ? error.message
          : "Failed to send your message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main-content section-container content-page">
      <div className="contact-header">
        <span className="contact-eyebrow">GET IN TOUCH</span>

        <h1>
          Contact the <span className="hl">RoBcodes</span> Team
        </h1>

        <p className="lead">
          Found a new game code, spotted an expired code, or interested in
          partnering with us? Send us a message and we'll take a look.
        </p>
      </div>

      {submitted ? (
        <div className="contact-success">
          <div className="success-icon">✓</div>
          <span className="success-badge">Message sent successfully</span>

          <h3>Your message has been sent</h3>

          <p>
            Thanks for reaching out. We have received your message and our team will
            review it shortly.
          </p>

          <div className="success-actions">
            <button
              type="button"
              className="game-card-btn"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </button>

            <a href="/" className="secondary-link">
              Back to homepage
            </a>
          </div>

          <div className="contact-socials">
            <div className="social-group">
              <h4>Developer</h4>
              <ul className="social-list">
                {developerLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="social-group">
              <h4>Support Team</h4>
              <ul className="social-list">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">
              Your Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Roblox Gamer"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Your Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={150}
              autoComplete="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message / Code Submission
            </label>

            <textarea
              id="message"
              name="message"
              rows={6}
              required
              minLength={5}
              maxLength={2000}
              placeholder="Tell us about a new working code, expired code, feedback, or partnership..."
              value={formData.message}
              onChange={handleChange}
            />

            <span className="character-count">
              {formData.message.length}/2000
            </span>
          </div>

          <button
            type="submit"
            className="game-card-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </main>
  );
}
"use client";

import Link from "next/link";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      setSubmitted(true);
      setFormData(initialFormData);
      showToast("Message sent! Thank you for reaching out.");
    } catch (error) {
      console.error("Contact form error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to send your message."
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
          partnering with us? Reach out directly or send us a message below.
        </p>
      </div>

      {/* ── Direct contact fallback — always visible, no form required ── */}
      <div className="contact-direct" aria-label="Direct contact options">
        <div className="contact-direct-item">
          <span className="contact-direct-icon" aria-hidden="true">✉️</span>
          <div>
            <strong>Email Support</strong>
            <p>
              <a
                href="mailto:aeroteam.agency@gmail.com"
                className="contact-direct-link"
              >
                aeroteam.agency@gmail.com
              </a>
            </p>
            <span className="contact-direct-note">We reply within 24–48 hours</span>
          </div>
        </div>

        <div className="contact-direct-item">
          <span className="contact-direct-icon" aria-hidden="true">💬</span>
          <div>
            <strong>Discord Community</strong>
            <p>
              <a
                href="https://dsc.gg/robcodes"
                target="_blank"
                rel="noreferrer noopener"
                className="contact-direct-link"
              >
                dsc.gg/robcodes
              </a>
            </p>
            <span className="contact-direct-note">Fastest response — live chat with the team</span>
          </div>
        </div>
      </div>
      {/* ── End direct contact ── */}

      {submitted ? (
        <div className="contact-success">
          <div className="success-icon">✓</div>
          <span className="success-badge">Message sent successfully</span>
          <h3>Your message has been sent</h3>
          <p>
            Thanks for reaching out. We have received your message and our team will
            review it shortly. Alternatively, join our Discord for faster replies.
          </p>
          <div className="success-actions">
            <button
              type="button"
              className="game-card-btn"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </button>
            <Link href="/" className="secondary-link">
              Back to homepage
            </Link>
          </div>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
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
            <label htmlFor="email">Your Email Address</label>
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
            <label htmlFor="message">Message / Code Submission</label>
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
            <span className="character-count">{formData.message.length}/2000</span>
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
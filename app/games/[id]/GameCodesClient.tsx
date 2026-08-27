"use client";

import { useState } from "react";
import Image from "next/image";
import { Game as SupabaseGame } from "@/src/lib/supabase";
import GameCard from "@/src/components/GameCard";
import { useToast } from "@/src/components/Toast";
import {
  FaCopy,
  FaCheck,
  FaThumbsUp,
  FaUsers,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaGift,
  FaQuestionCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface GameCodesClientProps {
  game: SupabaseGame | any;
  relatedGames: any[];
}

export default function GameCodesClient({ game, relatedGames }: GameCodesClientProps) {
  const { showToast } = useToast();
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const bannerUrl = game.banner_url || game.bannerUrl || "/og-image.png";
  const imageUrl = game.image_url || game.imageUrl || "/og-image.png";
  const activePlayers = game.active_players || game.activePlayers;
  const codesList = game.codes || [];
  const activeCodes = codesList.filter((c: any) => c.status === "active");
  const expiredCodes = codesList.filter((c: any) => c.status === "expired");

  const redeemSteps: string[] = game.redeem_steps
    ? game.redeem_steps.map((s: any) => s.step_text)
    : game.howToRedeem || [];

  const faqs = game.faqs || [];

  const updatedAtStr = game.updated_at
    ? new Date(game.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : game.updatedAt || "August 2026";

  // Derive a readable "last verified" date (use updated_at or today as fallback)
  const lastVerified = game.updated_at
    ? new Date(game.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const handleCopyCode = (codeText: string, codeId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(codeId);
    showToast(`Copied code "${codeText}" to clipboard!`);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  return (
    <>
      <section className="game-detail-hero" aria-label="Game header information">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${bannerUrl})` }} aria-hidden="true" />
        <div className="hero-content">
          <Image
            src={imageUrl}
            alt={`${game.title} official game icon`}
            className="hero-thumb"
            width={200}
            height={200}
            priority
            unoptimized={imageUrl?.includes("rbxcdn.com") || imageUrl?.startsWith("http")}
          />
          <div className="hero-info">
            <div className="hero-badges">
              <span className="badge badge-category">{game.category}</span>
              <span className="badge badge-active">{activeCodes.length} Working Codes</span>
            </div>

            <h1>{game.title} Codes</h1>
            <p className="hero-dev">
              Developed by <strong>{game.developer}</strong>
            </p>

            <div className="hero-meta">
              <span>
                <FaClock /> Updated: {updatedAtStr}
              </span>
              <span>
                <FaThumbsUp /> {game.likes} Likes
              </span>
              <span>
                <FaUsers /> {activePlayers} Players
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container" aria-label="Game details and codes">
        <div className="game-intro-box">
          <p>{game.description}</p>
        </div>

        <div className="codes-section">
          <div className="codes-header">
            <h2>
              <FaGift className="section-icon" aria-hidden="true" /> Active {game.title} Codes ({activeCodes.length})
            </h2>
            <p>
              Click any button below to copy the code to your clipboard.{" "}
              <span className="last-verified" aria-label={`Codes last verified on ${lastVerified}`}>
                ✓ Last verified: {lastVerified}
              </span>
            </p>
          </div>

          {activeCodes.length > 0 ? (
            <ul className="codes-list" role="list" aria-label="Active redeem codes">
              {activeCodes.map((c: any) => (
                <li key={c.id} className="code-card" role="listitem">
                  <div className="code-card-info">
                    <div className="code-card-header">
                      <code className="code-text" aria-label={`Redeem code: ${c.code}`}>
                        {c.code}
                      </code>
                      {(c.is_new ?? c.isNew) && (
                        <span className="badge badge-new" aria-label="New code">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="code-reward">
                      <strong>Reward:</strong> <span>{c.reward}</span>
                    </p>
                  </div>

                  <button
                    className={`copy-btn ${copiedCodeId === c.id ? "copied" : ""}`}
                    onClick={() => handleCopyCode(c.code, c.id)}
                    title={`Copy code ${c.code}`}
                    aria-label={`Copy code ${c.code} for reward: ${c.reward}`}
                  >
                    {copiedCodeId === c.id ? (
                      <>
                        <FaCheck /> Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copy Code
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-codes-box">
              <FaExclamationTriangle className="warning-icon" />
              <p>There are currently no active codes for this game. Check back soon for new updates!</p>
            </div>
          )}
        </div>

        {expiredCodes.length > 0 && (
          <section className="expired-section" aria-label="Expired codes archive">
            <h2>Expired {game.title} Codes ({expiredCodes.length})</h2>
            <button
              className="expired-toggle-btn"
              onClick={() => setShowExpired(!showExpired)}
              aria-expanded={showExpired}
              aria-label="Toggle expired codes visibility"
            >
              <span>Show expired codes</span>
              {showExpired ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
            </button>

            {showExpired && (
              <div className="expired-list">
                <p className="expired-notice">
                  ⚠️ Note: These codes have expired and no longer reward anything, but are listed for reference.
                </p>
                <ul role="list" aria-label="Expired redeem codes">
                  {expiredCodes.map((c: any) => (
                    <li key={c.id} className="code-card expired" role="listitem">
                      <div className="code-card-info">
                        <code className="code-text strikethrough" aria-label={`Expired code: ${c.code}`}>
                          {c.code}
                        </code>
                        <p className="code-reward">{c.reward}</p>
                      </div>
                      <span className="badge badge-expired" aria-label="This code has expired">
                        Expired
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {redeemSteps.length > 0 && (
          <section className="how-to-redeem-box" aria-label="Redemption guide">
            <h2>🎮 How to Redeem Codes in {game.title}</h2>
            <ol className="steps-list">
              {redeemSteps.map((step, index) => (
                <li key={index}>
                  <span className="step-num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="faq-section" aria-label="Frequently asked questions">
            <h2>
              <FaQuestionCircle className="section-icon" aria-hidden="true" /> Frequently Asked Questions
            </h2>
            {/*
              SSR-SAFE ACCORDION: All FAQ answers are rendered in the initial server HTML
              (critical for Googlebot indexing and FAQ rich snippets). Visibility is
              controlled via CSS using the data-open attribute, not conditional rendering.
            */}
            <div className="faq-accordion" role="region" aria-label="FAQs">
              {faqs.map((faq: any, index: number) => (
                <div key={index} className="faq-item" data-open={openFaqIndex === index ? "true" : "false"}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span>{faq.question}</span>
                    {openFaqIndex === index ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                  </button>
                  {/* Answer is ALWAYS in the DOM for SSR/Googlebot — CSS hides it when data-open="false" */}
                  <div
                    className="faq-answer"
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedGames.length > 0 && (
          <section className="related-games-section" aria-label="Related games">
            <h2>More {game.category} Roblox Games</h2>
            <div className="games-grid" role="list">
              {relatedGames.map((rg) => (
                <div key={rg.id} role="listitem">
                  <GameCard game={rg} />
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </>
  );
}
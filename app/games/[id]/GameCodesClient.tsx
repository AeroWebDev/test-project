"use client";

import { useState } from "react";
import Link from "next/link";
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
  FaExclamationTriangle
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

  const bannerUrl = game.banner_url || game.bannerUrl;
  const imageUrl = game.image_url || game.imageUrl;
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
      {/* Hero Banner Section */}
      <section className="game-detail-hero">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${bannerUrl})` }}></div>
        <div className="hero-content">
          <img src={imageUrl} alt={`${game.title} Cover`} className="hero-thumb" />
          <div className="hero-info">
            <div className="hero-badges">
              <span className="badge badge-category">{game.category}</span>
              <span className="badge badge-active">{activeCodes.length} Working Codes</span>
            </div>

            <h1>{game.title} Codes</h1>
            <p className="hero-dev">Developed by <strong>{game.developer}</strong></p>

            <div className="hero-meta">
              <span><FaClock /> Updated: {updatedAtStr}</span>
              <span><FaThumbsUp /> {game.likes} Likes</span>
              <span><FaUsers /> {activePlayers} Players</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container">
        {/* Game Description */}
        <div className="game-intro-box">
          <p>{game.description}</p>
        </div>

        {/* Active Codes Section */}
        <div className="codes-section">
          <div className="codes-header">
            <h2><FaGift className="section-icon" /> Active {game.title} Codes ({activeCodes.length})</h2>
            <p>Click any button below to copy the code to your clipboard.</p>
          </div>

          {activeCodes.length > 0 ? (
            <div className="codes-list">
              {activeCodes.map((c: any) => (
                <div key={c.id} className="code-card">
                  <div className="code-card-info">
                    <div className="code-card-header">
                      <span className="code-text">{c.code}</span>
                      {(c.is_new ?? c.isNew) && <span className="badge badge-new">NEW</span>}
                    </div>
                    <p className="code-reward"><strong>Reward:</strong> {c.reward}</p>
                  </div>

                  <button
                    className={`copy-btn ${copiedCodeId === c.id ? "copied" : ""}`}
                    onClick={() => handleCopyCode(c.code, c.id)}
                    title={`Copy ${c.code}`}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="no-codes-box">
              <FaExclamationTriangle className="warning-icon" />
              <p>There are currently no active codes for this game. Check back soon for new updates!</p>
            </div>
          )}
        </div>

        {/* Expired Codes Section */}
        {expiredCodes.length > 0 && (
          <div className="expired-section">
            <button
              className="expired-toggle-btn"
              onClick={() => setShowExpired(!showExpired)}
            >
              <span>Expired {game.title} Codes ({expiredCodes.length})</span>
              {showExpired ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {showExpired && (
              <div className="expired-list">
                <p className="expired-notice">
                  Note: These codes have expired and no longer reward anything, but are listed for reference.
                </p>
                {expiredCodes.map((c: any) => (
                  <div key={c.id} className="code-card expired">
                    <div className="code-card-info">
                      <span className="code-text strikethrough">{c.code}</span>
                      <p className="code-reward">{c.reward}</p>
                    </div>
                    <span className="badge badge-expired">Expired</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* How to Redeem Instructions */}
        {redeemSteps.length > 0 && (
          <div className="how-to-redeem-box">
            <h2>🎮 How to Redeem Codes in {game.title}</h2>
            <ol className="steps-list">
              {redeemSteps.map((step, index) => (
                <li key={index}>
                  <span className="step-num">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Frequently Asked Questions */}
        {faqs.length > 0 && (
          <div className="faq-section">
            <h2><FaQuestionCircle className="section-icon" /> Frequently Asked Questions</h2>
            <div className="faq-accordion">
              {faqs.map((faq: any, index: number) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    {openFaqIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {openFaqIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Games Recommendation */}
        {relatedGames.length > 0 && (
          <div className="related-games-section">
            <h2>More {game.category} Roblox Games</h2>
            <div className="games-grid">
              {relatedGames.map((rg) => (
                <GameCard key={rg.id} game={rg} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

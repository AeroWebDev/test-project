import Link from "next/link";
import GameSearch from "../src/components/GameSearch";
import GameCard from "../src/components/GameCard";
import { getTrendingGames, getAllGames } from "../src/lib/supabase";
import { FaShieldAlt, FaBolt, FaSyncAlt } from "react-icons/fa";

export const revalidate = 60;

export default async function HomePage() {
  const [trendingGames, allGames] = await Promise.all([
    getTrendingGames(),
    getAllGames(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://robcodes.net";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RoBcodes",
    url: siteUrl,
    description: "Daily verified Roblox game redeem codes for Blox Fruits, Blade Ball, King Legacy, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/games?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <section className="homepage-hero" aria-label="RoBcodes introduction">
        <h1 className="sr-only">RoBcodes - Free Roblox Game Codes & Daily Verified Promo Codes 2026</h1>
        <GameSearch />
      </section>

      <section className="features-banner" aria-label="Why choose RoBcodes">
        <ul className="features-list">
          <li className="feature-item">
            <FaBolt className="feature-icon" aria-hidden="true" />
            <div>
              <h2>1-Tap Instant Copy</h2>
              <p>Click any code to copy instantly to your clipboard.</p>
            </div>
          </li>
          <li className="feature-item">
            <FaShieldAlt className="feature-icon" aria-hidden="true" />
            <div>
              <h2>100% Tested & Working</h2>
              <p>Our team verifies codes daily to remove expired ones.</p>
            </div>
          </li>
          <li className="feature-item">
            <FaSyncAlt className="feature-icon" aria-hidden="true" />
            <div>
              <h2>Daily Code Updates</h2>
              <p>Fresh codes added as soon as game devs publish updates.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="section-container" aria-label="Trending games">
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 Trending Roblox Games</h2>
            <p className="section-sub">Hot games with the newest working redeem codes right now</p>
          </div>
          <Link href="/games" className="see-all-link">
            View All Games ({allGames.length}) →
          </Link>
        </div>

        <div className="games-grid">
          {trendingGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="section-container" aria-label="All games catalog">
        <div className="section-header">
          <div>
            <h2 className="section-title">🎮 All Roblox Games</h2>
            <p className="section-sub">Browse all games in our codes directory</p>
          </div>
        </div>

        <div className="games-grid">
          {allGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="section-container seo-section" aria-label="How to redeem Roblox codes guide">
        <h2>How to Redeem Roblox Game Codes on RoBcodes</h2>
        <p>
          Welcome to <strong>RoBcodes</strong>, your #1 source for active, daily-tested Roblox game promo codes! Whether you are seeking <strong>2x EXP boosts in Blox Fruits</strong>, free gems in <em>Blade Ball</em>, stat resets in <em>King Legacy</em>, or summons in <em>Anime Defenders</em>, we provide instant one-tap copy functionality to get your rewards instantly.
        </p>
        <div className="seo-grid">
          <div className="seo-card">
            <h3>1. Find Your Favorite Game</h3>
            <p>Use our real-time search bar at the top or browse by category (Anime, RPG, Simulator, Action, Tower Defense) to open any game page.</p>
          </div>
          <div className="seo-card">
            <h3>2. Copy Working Codes</h3>
            <p>Click the <strong>Copy Code</strong> button next to any active working code. The code will copy directly to your clipboard with zero hassle.</p>
          </div>
          <div className="seo-card">
            <h3>3. Redeem In-Game</h3>
            <p>Launch Roblox, open the in-game codes redemption panel (usually marked by a Twitter bird icon, Settings gear, or Shop icon), paste your code, and enjoy your free rewards!</p>
          </div>
        </div>
      </section>
    </main>
  );
}

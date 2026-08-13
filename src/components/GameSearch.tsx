"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchGames, getTotalActiveCodesCount, getAllGames } from "../lib/supabase";

export default function GameSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalGames, setTotalGames] = useState<number>(6);
  const [totalActive, setTotalActive] = useState<number>(20);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Load stats
  useEffect(() => {
    async function loadStats() {
      const [games, activeCount] = await Promise.all([
        getAllGames(),
        getTotalActiveCodesCount(),
      ]);
      setTotalGames(games.length);
      setTotalActive(activeCount);
    }
    loadStats();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    let isMounted = true;
    async function performSearch() {
      const results = await searchGames(query);
      if (isMounted) setSearchResults(results);
    }

    const timer = setTimeout(performSearch, 150);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Keyboard navigation (Escape to close, Enter to submit search)
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setFocused(false);
    } else if (e.key === "Enter" && query.trim()) {
      setFocused(false);
      router.push(`/games?q=${encodeURIComponent(query.trim())}`);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = focused && query.trim() !== "";

  return (
    <section className="game-search">
      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-chip">
          <span className="stat-dot"></span>
          <span><strong>{totalGames}</strong> Games Tracked</span>
        </div>
        <div className="stat-chip">
          <span className="stat-dot green"></span>
          <span><strong>{totalActive}+</strong> Active Codes</span>
        </div>
        <div className="stat-chip">
          <span className="stat-dot amber"></span>
          <span>Updated <strong>Daily</strong></span>
        </div>
      </div>

      {/* Main heading */}
      <h1 className="hero-heading">
        <span className="hero-emoji" role="img" aria-label="Ninja">🥷</span>
        <div className="hero-text">
          Find Your Game Code.
          <br />
          <span className="hl">Copy It Instantly.</span>
        </div>
      </h1>

      <p className="sub">
        Every Roblox promo code — verified daily, copied in <span className="hl">one tap</span>.
      </p>

      {/* Search input */}
      <div className="search-outer" ref={wrapRef}>
        <div className={`search-wrap ${focused ? "focused" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="searchInput"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Blox Fruits, Blade Ball, King Legacy…"
            autoComplete="off"
            aria-label="Search for a Roblox game"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />
          {query && (
            <button className="clear-search" onClick={() => setQuery("")} title="Clear" aria-label="Clear search">
              ✕
            </button>
          )}
          <Link href="/games" className="browse-all-btn">
            Browse All
          </Link>
        </div>

        {/* Live search dropdown */}
        {showDropdown && (
          <div className="search-dropdown" role="listbox">
            {searchResults.length > 0 ? (
              <>
                <div className="search-dropdown-label">Results for &ldquo;{query}&rdquo;</div>
                {searchResults.map((game) => {
                  const codesList = game.codes || [];
                  const activeCount = codesList.filter((c: any) => c.status === "active").length;
                  const thumb = game.image_url || game.imageUrl;

                  return (
                    <Link
                      key={game.id}
                      href={`/games/${game.slug}`}
                      className="search-dropdown-item"
                      onClick={() => { setQuery(""); setFocused(false); }}
                      role="option"
                    >
                      <img src={thumb} alt={game.title} className="search-thumb" />
                      <div className="search-info">
                        <h4>{game.title}</h4>
                        <p>{game.category} · {game.developer}</p>
                      </div>
                      <span className="search-badge">{activeCount} active</span>
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="no-results">
                <span>😕</span> No games found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick category pills */}
      <div className="quick-categories">
        <span>Browse by:</span>
        <Link href="/games?cat=Anime" className="chip">🌸 Anime</Link>
        <Link href="/games?cat=Simulator" className="chip">🎮 Simulators</Link>
        <Link href="/games?cat=Action" className="chip">⚔️ Action</Link>
        <Link href="/games?cat=Tower Defense" className="chip">🏯 Tower Defense</Link>
        <Link href="/games?cat=RPG" className="chip">🗡️ RPG</Link>
      </div>
    </section>
  );
}

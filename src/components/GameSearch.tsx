"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchGames } from "../lib/supabase";
import { FaStar, FaGamepad, FaBolt, FaHammer, FaFrownOpen, FaSearch, FaTimes, FaScroll } from "react-icons/fa";

export default function GameSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

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
      {/* Main heading */}
      <h1 className="hero-heading">
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
          <FaSearch aria-hidden="true" />
          <input
            id="searchInput"
            type="text"
            role="combobox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Blox Fruits, Blade Ball, King Legacy…"
            autoComplete="off"
            aria-label="Search for a Roblox game"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="search-dropdown-list"
          />
          {query && (
            <button className="clear-search" onClick={() => setQuery("")} title="Clear" aria-label="Clear search">
              <FaTimes />
            </button>
          )}
          <Link href="/games" className="browse-all-btn">
            Browse All
          </Link>
        </div>

        {/* Live search dropdown */}
        {showDropdown && (
          <div className="search-dropdown" id="search-dropdown-list" role="listbox">
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
                <FaFrownOpen /> No games found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick category pills */}
      <div className="quick-categories">
        <span>Browse by:</span>
        <Link href="/games?cat=Anime" className="chip"><FaStar /> Anime</Link>
        <Link href="/games?cat=Simulator" className="chip"><FaGamepad /> Simulators</Link>
        <Link href="/games?cat=Action" className="chip"><FaBolt /> Action</Link>
        <Link href="/games?cat=Tower Defense" className="chip"><FaHammer /> Tower Defense</Link>
        <Link href="/games?cat=RPG" className="chip"><FaScroll /> RPG</Link>
      </div>
    </section>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GameCard from "@/src/components/GameCard";
import { getAllGames } from "@/src/lib/supabase";
import { FaSearch, FaFilter } from "react-icons/fa";

const CATEGORIES = ["All", "Anime", "Simulator", "RPG", "Action", "Tower Defense"];

export default function GamesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("cat") || "All";
  const initialSearch = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"trending" | "alpha" | "codes">("trending");
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAllGames();
      setAllGames(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      newParams.delete("cat");
    } else {
      newParams.set("cat", cat);
    }
    router.push(`/games?${newParams.toString()}`);
  };

  const filteredGames = useMemo(() => {
    let result = [...allGames];

    if (selectedCategory !== "All") {
      result = result.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.developer.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "codes") {
      result.sort(
        (a, b) =>
          ((b.codes || []).filter((c: any) => c.status === "active").length) -
          ((a.codes || []).filter((c: any) => c.status === "active").length)
      );
    } else {
      result.sort((a, b) => ((b.is_trending ?? b.isTrending) ? 1 : 0) - ((a.is_trending ?? a.isTrending) ? 1 : 0));
    }

    return result;
  }, [allGames, selectedCategory, searchTerm, sortBy]);

  return (
    <>
      {/* Page Header */}
      <section className="catalog-hero">
        <h1>🎮 Roblox Game Codes Directory</h1>
        <p>Find working redeem codes for your favorite Roblox games.</p>

        {/* Search bar inside catalog */}
        <div className="catalog-search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Filter games by title or developer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filter games by title or developer"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
      </section>

      <section className="section-container">
        {/* Controls Bar */}
        <div className="catalog-controls">
          {/* Category Filter Chips */}
          <div className="category-chips">
            <span className="filter-label"><FaFilter /> Genre:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="sort-wrap">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "trending" | "alpha" | "codes")}
            >
              <option value="trending">🔥 Trending First</option>
              <option value="codes">🔑 Most Active Codes</option>
              <option value="alpha">🔤 Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="results-count">
          Showing <strong>{filteredGames.length}</strong> games
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="games-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="game-card skeleton" style={{ height: "300px" }}></div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="games-grid">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="no-games-found">
            <h3>No games found</h3>
            <p>Try clearing your search filters or select another category.</p>
            <button
              className="game-card-btn"
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}

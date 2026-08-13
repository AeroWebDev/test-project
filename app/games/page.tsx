import { Metadata } from "next";
import { Suspense } from "react";
import GamesCatalogContent from "./GamesCatalogContent";

export const metadata: Metadata = {
  title: "Browse All Roblox Game Codes Directory (2026)",
  description: "Search and filter active Roblox game codes by genre: Anime, Simulator, RPG, Action, and Tower Defense. Free promo codes updated daily.",
  keywords: ["roblox games catalog", "roblox game codes list", "anime roblox codes", "simulator roblox codes", "rpg roblox codes"],
};

export default function GamesPage() {
  return (
    <main className="main-content">
      <Suspense fallback={<div className="section-container">Loading games catalog...</div>}>
        <GamesCatalogContent />
      </Suspense>
    </main>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug, getAllGameSlugs, getGamesByCategory } from "@/src/lib/supabase";
import GameCodesClient from "./GameCodesClient";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60; // Revalidate every 60s

export async function generateStaticParams() {
  const slugs = await getAllGameSlugs();
  return slugs.map((slug) => ({
    id: slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameBySlug(id);

  if (!game) {
    return {
      title: "Game Not Found",
      description: "The requested Roblox game codes page could not be found.",
    };
  }

  const activeCount = (game.codes || []).filter((c) => c.status === "active").length;
  const updatedAt = game.updated_at ? new Date(game.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "2026";
  const image = game.banner_url || game.image_url || "";

  return {
    title: `${game.title} Codes (${updatedAt}) - ${activeCount} Working Rewards`,
    description: `Get all active ${game.title} Roblox promo codes for ${updatedAt}. Copy working codes for free rewards, boosts, gems, and stat resets instantly on RoBcodes!`,
    keywords: [`${game.title} codes`, `${game.title} roblox codes`, `${game.title} redeem codes`, `${game.title} codes 2026`],
    openGraph: {
      title: `${game.title} Codes (${updatedAt}) - Free Rewards`,
      description: `Active working codes for ${game.title}. 1-tap copy codes!`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} Codes (${updatedAt})`,
      description: `Active working codes for ${game.title}. 1-tap copy codes!`,
      images: [image],
    },
  };
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const { id } = await params;
  const game = await getGameBySlug(id);

  if (!game) {
    notFound();
  }

  const categoryGames = await getGamesByCategory(game.category);
  const relatedGames = categoryGames
    .filter((g) => g.id !== game.id)
    .slice(0, 3);

  // Structured Data Schema for Google Search Engine Bots
  const gameSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": `${game.title} (Roblox)`,
        "operatingSystem": "Roblox Platform",
        "applicationCategory": "GameApplication",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1250"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": (game.faqs || []).map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://robcodes.net"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Games",
            "item": "https://robcodes.net/games"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": game.title,
            "item": `https://robcodes.net/games/${game.slug}`
          }
        ]
      }
    ]
  };

  return (
    <main className="main-content">
      {/* Inject JSON-LD Schema into server-rendered HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />

      <GameCodesClient game={game} relatedGames={relatedGames} />
    </main>
  );
}

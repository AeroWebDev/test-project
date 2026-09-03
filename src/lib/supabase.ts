import { createClient } from "@supabase/supabase-js";
import { GAMES_DATA, Game as LocalGame } from "../data/gamesData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Public client — for reading games, codes, etc.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// TYPE DEFINITIONS (mirrors DB schema exactly)
// =============================================

export interface Game {
  id: string;
  slug: string;
  title: string;
  category: "Anime" | "Simulator" | "RPG" | "Action" | "Tower Defense";
  developer: string;
  description: string | null;
  likes: string | null;
  active_players: string | null;
  image_url: string | null;
  banner_url: string | null;
  is_trending: boolean;
  is_published: boolean;
  updated_at: string;
  created_at?: string;
  // Joined relations
  codes?: Code[];
  redeem_steps?: RedeemStep[];
  faqs?: FAQ[];
}

export interface Code {
  id: string;
  game_id: string;
  code: string;
  reward: string;
  is_new: boolean;
  status: "active" | "expired";
  expires_at: string | null;
  added_date?: string;
  created_at?: string;
}

export interface RedeemStep {
  id: string;
  game_id: string;
  step_num: number;
  step_text: string;
}

export interface FAQ {
  id: string;
  game_id: string;
  question: string;
  answer: string;
  order_num?: number;
}

export interface GameAnalyticsDaily {
  id?: string;
  game_id: string;
  date: string;
  views: number;
  unique_visitors: number;
  code_copies: number;
  discord_clicks: number;
  exclusive_unlocks: number;
  created_at?: string;
  updated_at?: string;
}

// Convert local mock format to DB Game format for graceful fallback
function mapLocalToDbGame(local: LocalGame): Game {
  return {
    id: local.id,
    slug: local.slug,
    title: local.title,
    category: local.category,
    developer: local.developer,
    description: local.description,
    likes: local.likes,
    active_players: local.activePlayers,
    image_url: local.imageUrl,
    banner_url: local.bannerUrl,
    is_trending: !!local.isTrending,
    is_published: true,
    updated_at: local.updatedAt,
    codes: local.codes.map((c) => ({
      id: c.id,
      game_id: local.id,
      code: c.code,
      reward: c.reward,
      is_new: !!c.isNew,
      status: c.status,
      expires_at: null,
      added_date: c.addedDate,
    })),
    redeem_steps: local.howToRedeem.map((text, idx) => ({
      id: `step-${idx}`,
      game_id: local.id,
      step_num: idx + 1,
      step_text: text,
    })),
    faqs: local.faqs.map((f, idx) => ({
      id: `faq-${idx}`,
      game_id: local.id,
      question: f.question,
      answer: f.answer,
      order_num: idx + 1,
    })),
  };
}

// =============================================
// READ FUNCTIONS — with graceful fallback to mock data
// =============================================

/** Get all published games for the catalog page */
export async function getAllGames(): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("is_published", true)
      .order("is_trending", { ascending: false });

    if (!error && data && data.length > 0) {
      // Fetch codes for all games in parallel
      const gamesWithCodes = await Promise.all(
        data.map(async (game) => {
          const { data: codesData } = await supabase
            .from("codes")
            .select("*")
            .eq("game_id", game.id);
          return {
            ...game,
            codes: codesData ?? [],
          };
        })
      );
      return gamesWithCodes;
    }
  } catch (err) {
    console.warn("Supabase fetch fallback:", err);
  }
  return GAMES_DATA.map(mapLocalToDbGame);
}

/** Get only trending games for the home page */
export async function getTrendingGames(): Promise<Game[]> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("is_published", true)
      .eq("is_trending", true);

    if (!error && data && data.length > 0) {
      // Fetch codes for all games in parallel
      const gamesWithCodes = await Promise.all(
        data.map(async (game) => {
          const { data: codesData } = await supabase
            .from("codes")
            .select("*")
            .eq("game_id", game.id);
          return {
            ...game,
            codes: codesData ?? [],
          };
        })
      );
      return gamesWithCodes;
    }
  } catch (err) {
    console.warn("Supabase fetch fallback:", err);
  }
  return GAMES_DATA.filter((g) => g.isTrending).map(mapLocalToDbGame);
}

/** Get games by category */
export async function getGamesByCategory(category: string): Promise<Game[]> {
  try {
    let query = supabase.from("games").select("*").eq("is_published", true);

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("is_trending", { ascending: false });
    if (!error && data && data.length > 0) {
      // Fetch codes for all games in parallel
      const gamesWithCodes = await Promise.all(
        data.map(async (game) => {
          const { data: codesData } = await supabase
            .from("codes")
            .select("*")
            .eq("game_id", game.id);
          return {
            ...game,
            codes: codesData ?? [],
          };
        })
      );
      return gamesWithCodes;
    }
  } catch (err) {
    console.warn("Supabase fetch fallback for category:", category, err);
  }

  const filtered = GAMES_DATA.filter(
    (g) => !category || category === "All" || g.category.toLowerCase() === category.toLowerCase()
  );
  return filtered.map(mapLocalToDbGame);
}

/** Get a single game with all its codes, steps, and FAQs */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  try {
    const { data: game, error } = await supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!error && game) {
      const [codesRes, stepsRes, faqsRes] = await Promise.all([
        supabase
          .from("codes")
          .select("*")
          .eq("game_id", game.id)
          .order("status", { ascending: true }),
        supabase
          .from("redeem_steps")
          .select("*")
          .eq("game_id", game.id)
          .order("step_num", { ascending: true }),
        supabase
          .from("faqs")
          .select("*")
          .eq("game_id", game.id)
          .order("order_num", { ascending: true }),
      ]);

      return {
        ...game,
        codes: codesRes.data ?? [],
        redeem_steps: stepsRes.data ?? [],
        faqs: faqsRes.data ?? [],
      };
    }
  } catch (err) {
    console.warn("Supabase fetch fallback for slug:", slug, err);
  }

  const local = GAMES_DATA.find((g) => g.slug === slug);
  return local ? mapLocalToDbGame(local) : null;
}

/** Get all slugs for static page generation */
export async function getAllGameSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("slug")
      .eq("is_published", true);

    if (!error && data && data.length > 0) {
      return data.map((g) => g.slug);
    }
  } catch (err) {
    console.warn("Supabase fetch fallback for slugs:", err);
  }
  return GAMES_DATA.map((g) => g.slug);
}

/** Get total count of active codes across all games */
export async function getTotalActiveCodesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("codes")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (!error && typeof count === "number" && count > 0) {
      return count;
    }
  } catch (err) {
    console.warn("Supabase count fallback:", err);
  }
  return GAMES_DATA.reduce(
    (acc, g) => acc + g.codes.filter((c) => c.status === "active").length,
    0
  );
}

/** Search games by title, category, or developer */
export async function searchGames(query: string): Promise<Game[]> {
  if (!query || !query.trim()) return [];
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*, codes(id, status)")
      .eq("is_published", true)
      .or(`title.ilike.%${query}%,developer.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(8);

    if (!error && data && data.length > 0) {
      return data as Game[];
    }
  } catch (err) {
    console.warn("Supabase search fallback:", err);
  }
  const q = query.toLowerCase();
  return GAMES_DATA.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.developer.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
  ).map(mapLocalToDbGame);
}

// Admin helper
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

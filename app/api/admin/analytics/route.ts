import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { fetchGA4GameMetrics } from "@/src/lib/ga-data-api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const gameSlug = searchParams.get("gameSlug");

    if (!gameId && !gameSlug) {
      return NextResponse.json({ error: "gameId or gameSlug required" }, { status: 400 });
    }

    let stats = {
      views: 0,
      uniqueVisitors: 0,
      codeCopies: 0,
      discordClicks: 0,
      exclusiveUnlocks: 0,
    };

    // 1. Fetch from Supabase game_analytics_daily if available
    try {
      let query = supabase.from("game_analytics_daily").select("*");
      if (gameId) query = query.eq("game_id", gameId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        stats.views = data.reduce((acc, row) => acc + (row.views || 0), 0);
        stats.uniqueVisitors = data.reduce((acc, row) => acc + (row.unique_visitors || 0), 0);
        stats.codeCopies = data.reduce((acc, row) => acc + (row.code_copies || 0), 0);
        stats.discordClicks = data.reduce((acc, row) => acc + (row.discord_clicks || 0), 0);
        stats.exclusiveUnlocks = data.reduce((acc, row) => acc + (row.exclusive_unlocks || 0), 0);
      }
    } catch (dbErr) {
      console.debug("[Analytics Fetch DB Note]", dbErr);
    }

    // 2. Supplement with GA4 Server API if configured
    if (gameSlug) {
      const gaMetrics = await fetchGA4GameMetrics(gameSlug);
      if (gaMetrics) {
        stats.views = Math.max(stats.views, gaMetrics.views || 0);
        stats.uniqueVisitors = Math.max(stats.uniqueVisitors, gaMetrics.uniqueVisitors || 0);
      }
    }

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

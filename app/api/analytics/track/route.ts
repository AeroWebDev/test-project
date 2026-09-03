import { NextResponse } from "next/server";
import { createAdminClient } from "@/src/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { eventType, game_id, game_slug } = body;

    // Fast return if no eventType
    if (!eventType) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Only process game-specific events if game_id is provided and valid
    if (game_id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const today = new Date().toISOString().split("T")[0];
      const supabaseAdmin = createAdminClient();

      try {
        // Try calling RPC increment or direct upsert for game_analytics_daily
        if (eventType === "game_view") {
          await supabaseAdmin.rpc("increment_game_analytics", {
            p_game_id: game_id,
            p_date: today,
            p_metric: "views",
          }).catch(() => {});
        } else if (eventType === "code_copy") {
          await supabaseAdmin.rpc("increment_game_analytics", {
            p_game_id: game_id,
            p_date: today,
            p_metric: "code_copies",
          }).catch(() => {});
        } else if (eventType === "discord_click") {
          await supabaseAdmin.rpc("increment_game_analytics", {
            p_game_id: game_id,
            p_date: today,
            p_metric: "discord_clicks",
          }).catch(() => {});
        }
      } catch (dbErr) {
        // Analytics failure should never break or throw
        console.debug("[Analytics Track DB Note]", dbErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // Return 200 OK so client beacons never fail
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

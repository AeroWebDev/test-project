import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(req: Request) {
  try {
    // Fetch all games from database
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching games:", error);
      return NextResponse.json(
        { error: "Failed to fetch games" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      games: games || [],
    });
  } catch (err: any) {
    console.error("Games API exception:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

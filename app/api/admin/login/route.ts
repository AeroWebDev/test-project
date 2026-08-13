import { NextResponse } from "next/server";
import { createAdminClient } from "@/src/lib/supabase";

export async function POST(req: Request) {
  try {
    const { accessUuid, password } = await req.json();

    if (!accessUuid || !password) {
      return NextResponse.json({ error: "Access UUID and password required" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Call RPC function `verify_admin_password`
    const { data, error } = await supabaseAdmin.rpc("verify_admin_password", {
      p_access_uuid: accessUuid,
      p_password: password,
    });

    if (error) {
      console.error("RPC verify_admin_password error:", error);
      return NextResponse.json({ error: "Authentication system error" }, { status: 500 });
    }

    if (!data || data.length === 0 || !data[0].is_valid) {
      return NextResponse.json({ error: "Invalid password or admin link" }, { status: 401 });
    }

    const gameId = data[0].game_id;
    const adminName = data[0].admin_name;

    // Fetch the game details for the admin dashboard
    const { data: game } = await supabaseAdmin
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    const { data: codes } = await supabaseAdmin
      .from("codes")
      .select("*")
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      adminName,
      game,
      codes: codes ?? [],
    });
  } catch (err: any) {
    console.error("Login API exception:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

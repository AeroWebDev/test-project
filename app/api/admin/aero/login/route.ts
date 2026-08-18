import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  try {
    const { password, isDashboard } = await req.json();

    // For Aero dashboard, check against environment variable
    if (isDashboard) {
      const envPassword = process.env.ADMIN_AERO_PASSWORD;

      if (!envPassword) {
        return NextResponse.json(
          { error: "Admin dashboard password not configured" },
          { status: 500 }
        );
      }

      if (password !== envPassword) {
        return NextResponse.json(
          { error: "Invalid admin password" },
          { status: 401 }
        );
      }

      // Fetch real data from Supabase
      let dashboardStats = {
        totalGames: 0,
        totalCodes: 0,
        activeCodes: 0,
        expiredCodes: 0,
      };

      try {
        // Count total games
        const { count: gamesCount } = await supabase
          .from("games")
          .select("*", { count: "exact", head: true });

        // Count total codes
        const { count: codesCount } = await supabase
          .from("codes")
          .select("*", { count: "exact", head: true });

        // Count active codes (not expired)
        const now = new Date().toISOString();
        const { count: activeCodesCount } = await supabase
          .from("codes")
          .select("*", { count: "exact", head: true })
          .or(`expires_at.is.null,expires_at.gt.${now}`);

        // Count expired codes
        const { count: expiredCodesCount } = await supabase
          .from("codes")
          .select("*", { count: "exact", head: true })
          .lt("expires_at", now);

        dashboardStats = {
          totalGames: gamesCount || 0,
          totalCodes: codesCount || 0,
          activeCodes: activeCodesCount || 0,
          expiredCodes: expiredCodesCount || 0,
        };
      } catch (dbErr) {
        console.error("Error fetching dashboard stats:", dbErr);
        // Return zeros if database fetch fails
      }

      // Authentication successful
      return NextResponse.json({
        success: true,
        adminName: "Aero Administrator",
        dashboardStats,
      });
    }

    // For game-specific admin panels (UUID-based)
    const { accessUuid } = await req.json();

    if (!accessUuid || !password) {
      return NextResponse.json(
        { error: "Access UUID and password required" },
        { status: 400 }
      );
    }

    // Fetch admin credentials from Supabase
    const { data: adminData, error: adminError } = await supabase
      .from("admin_credentials")
      .select("*")
      .eq("access_uuid", accessUuid)
      .single();

    if (adminError || !adminData) {
      return NextResponse.json({ error: "Invalid admin link" }, { status: 401 });
    }

    // Verify password
    if (adminData.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      adminName: adminData.admin_name,
      gameId: adminData.game_id,
    });
  } catch (err: any) {
    console.error("Login API exception:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

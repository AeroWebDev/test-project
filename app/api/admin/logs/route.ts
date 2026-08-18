import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(req: Request) {
  try {
    // Fetch all logs from database (if logs table exists)
    const { data: logs, error } = await supabase
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    // If logs table doesn't exist, return empty array (not an error)
    if (error && error.code === "PGRST116") {
      return NextResponse.json({
        success: true,
        logs: [],
      });
    }

    if (error) {
      console.error("Error fetching logs:", error);
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logs: logs || [],
    });
  } catch (err: any) {
    console.error("Logs API exception:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(req: Request) {
  try {
    // Fetch all codes from database
    const { data: codes, error } = await supabase
      .from("codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching codes:", error);
      return NextResponse.json(
        { error: "Failed to fetch codes" },
        { status: 500 }
      );
    }

    // Add status field based on expiration
    const now = new Date();
    const codesWithStatus = (codes || []).map((code: any) => ({
      ...code,
      status: code.expires_at && new Date(code.expires_at) < now ? "expired" : "active",
    }));

    return NextResponse.json({
      success: true,
      codes: codesWithStatus,
    });
  } catch (err: any) {
    console.error("Codes API exception:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

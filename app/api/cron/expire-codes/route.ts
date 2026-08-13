import { NextResponse } from "next/server";
import { createAdminClient } from "@/src/lib/supabase";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.rpc("auto_expire_codes");

    if (error) {
      console.error("Cron auto_expire_codes error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Expired codes updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Cron exception:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

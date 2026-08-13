import { NextResponse } from "next/server";
import { createAdminClient } from "@/src/lib/supabase";


export async function POST(req: Request) {
  try {
    const { accessUuid, password, action, codeData } = await req.json();

    if (!accessUuid || !password) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // Verify auth
    const { data: authData, error: authError } = await supabaseAdmin.rpc("verify_admin_password", {
      p_access_uuid: accessUuid,
      p_password: password,
    });

    if (authError || !authData || !authData[0]?.is_valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const gameId = authData[0].game_id;

    if (action === "ADD_CODE") {
      const { code, reward, expiresAt } = codeData;
      if (!code || !reward) {
        return NextResponse.json({ error: "Code and Reward are required" }, { status: 400 });
      }

      const { data: newCode, error: insertError } = await supabaseAdmin
        .from("codes")
        .insert({
          game_id: gameId,
          code: code.trim().toUpperCase(),
          reward: reward.trim(),
          is_new: true,
          status: "active",
          expires_at: expiresAt || null,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, code: newCode });
    }

    if (action === "TOGGLE_STATUS") {
      const { codeId, newStatus } = codeData;
      const { error: updateError } = await supabaseAdmin
        .from("codes")
        .update({ status: newStatus })
        .eq("id", codeId)
        .eq("game_id", gameId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "DELETE_CODE") {
      const { codeId } = codeData;
      const { error: deleteError } = await supabaseAdmin
        .from("codes")
        .delete()
        .eq("id", codeId)
        .eq("game_id", gameId);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: policies, error } = await supabaseAdmin
      .from("privacy_policies")
      .select("*")
      .eq("is_active", true)
      .order("policy_type", { ascending: true });

    if (error) {
      console.error("[PRIVACY-POLICIES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch privacy policies", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: policies });
  } catch (error) {
    console.error("[PRIVACY-POLICIES GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

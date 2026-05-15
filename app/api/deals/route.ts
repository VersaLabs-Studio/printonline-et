import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: deals, error } = await supabaseAdmin
      .from("homepage_deals")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[DEALS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch deals", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    console.error("[DEALS GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

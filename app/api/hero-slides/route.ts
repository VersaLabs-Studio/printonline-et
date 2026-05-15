import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: slides, error } = await supabaseAdmin
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[HERO-SLIDES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch hero slides", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("[HERO-SLIDES GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

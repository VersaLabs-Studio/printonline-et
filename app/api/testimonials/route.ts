import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: testimonials, error } = await supabaseAdmin
      .from("homepage_testimonials")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[TESTIMONIALS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch testimonials", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("[TESTIMONIALS GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

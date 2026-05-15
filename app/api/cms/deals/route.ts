import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { homepageDealSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: deals, error } = await supabaseAdmin
      .from("homepage_deals")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS DEALS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch deals", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    console.error("[CMS DEALS GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = homepageDealSchema.parse(body);

    const { data: deal, error } = await supabaseAdmin
      .from("homepage_deals")
      .insert({
        title: validatedData.title,
        subtitle: validatedData.subtitle || null,
        description: validatedData.description || null,
        image_url: validatedData.image_url || null,
        badge_text: validatedData.badge_text || null,
        badge_color: validatedData.badge_color,
        link_url: validatedData.link_url || null,
        link_text: validatedData.link_text,
        countdown_label: validatedData.countdown_label || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS DEALS POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create deal", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: deal }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS DEALS POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

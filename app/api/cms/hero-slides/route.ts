import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { heroSlideSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: slides, error } = await supabaseAdmin
      .from("hero_slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS HERO-SLIDES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch hero slides", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("[CMS HERO-SLIDES GET] Unexpected error:", error);
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
    const validatedData = heroSlideSchema.parse(body);

    const { data: slide, error } = await supabaseAdmin
      .from("hero_slides")
      .insert({
        title: validatedData.title,
        subtitle: validatedData.subtitle || null,
        image_url: validatedData.image_url,
        cta_text: validatedData.cta_text,
        cta_link: validatedData.cta_link,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS HERO-SLIDES POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create hero slide", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS HERO-SLIDES POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

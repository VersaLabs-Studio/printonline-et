import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { heroSlideSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: slide, error } = await supabaseAdmin
      .from("hero_slides")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Hero slide not found" },
          { status: 404 }
        );
      }
      console.error("[CMS HERO-SLIDES GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch hero slide", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: slide });
  } catch (error) {
    console.error("[CMS HERO-SLIDES GET ONE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = heroSlideSchema.parse(body);

    const { data: slide, error } = await supabaseAdmin
      .from("hero_slides")
      .update({
        title: validatedData.title,
        subtitle: validatedData.subtitle || null,
        image_url: validatedData.image_url,
        cta_text: validatedData.cta_text,
        cta_link: validatedData.cta_link,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Hero slide not found" },
          { status: 404 }
        );
      }
      console.error("[CMS HERO-SLIDES PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update hero slide", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: slide });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS HERO-SLIDES PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("hero_slides")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[CMS HERO-SLIDES DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete hero slide", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Hero slide deleted" });
  } catch (error) {
    console.error("[CMS HERO-SLIDES DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

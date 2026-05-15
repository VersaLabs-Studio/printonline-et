import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { homepageDealSchema } from "@/lib/validations/cms";
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

    const { data: deal, error } = await supabaseAdmin
      .from("homepage_deals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }
      console.error("[CMS DEALS GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch deal", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: deal });
  } catch (error) {
    console.error("[CMS DEALS GET ONE] Unexpected error:", error);
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
    const validatedData = homepageDealSchema.parse(body);

    const { data: deal, error } = await supabaseAdmin
      .from("homepage_deals")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }
      console.error("[CMS DEALS PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update deal", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: deal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS DEALS PUT] Unexpected error:", error);
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
      .from("homepage_deals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[CMS DEALS DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete deal", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Deal deleted" });
  } catch (error) {
    console.error("[CMS DEALS DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { categoryFormSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: categories, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS CATEGORIES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("[CMS CATEGORIES GET] Unexpected error:", error);
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
    const validatedData = categoryFormSchema.parse(body);

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .insert({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image_url: validatedData.imageUrl || null,
        display_order: validatedData.displayOrder,
        is_active: validatedData.isActive,
        meta_title: validatedData.metaTitle || null,
        meta_description: validatedData.metaDescription || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS CATEGORIES POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create category", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS CATEGORIES POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

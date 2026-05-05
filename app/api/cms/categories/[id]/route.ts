import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { categoryFormSchema } from "@/lib/validations/cms";
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

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      console.error("[CMS CATEGORIES GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch category", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("[CMS CATEGORIES GET ONE] Unexpected error:", error);
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
    const validatedData = categoryFormSchema.parse(body);

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .update({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image_url: validatedData.imageUrl || null,
        display_order: validatedData.displayOrder,
        is_active: validatedData.isActive,
        meta_title: validatedData.metaTitle || null,
        meta_description: validatedData.metaDescription || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      console.error("[CMS CATEGORIES PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update category", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS CATEGORIES PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const url = new URL(req.url);
    const hardDelete = url.searchParams.get("hard") === "true";

    if (hardDelete) {
      const { error } = await supabaseAdmin
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[CMS CATEGORIES DELETE] Error:", error);
        return NextResponse.json(
          { error: "Failed to delete category", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Category permanently deleted",
      });
    }

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      console.error("[CMS CATEGORIES DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to deactivate category", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category deactivated",
    });
  } catch (error) {
    console.error("[CMS CATEGORIES DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

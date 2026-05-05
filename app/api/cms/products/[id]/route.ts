import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { productFormSchema } from "@/lib/validations/cms";
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

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select(
        `*,
        category:categories(name, slug),
        product_images(*),
        product_options(*, product_option_values(*)),
        product_pricing_matrix(*),
        designer_fee_tiers(*)`
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      console.error("[CMS PRODUCTS GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch product", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[CMS PRODUCTS GET ONE] Unexpected error:", error);
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
    const validatedData = productFormSchema.parse(body);

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update({
        name: validatedData.name,
        slug: validatedData.slug,
        category_id: validatedData.categoryId || null,
        description: validatedData.description || null,
        short_description: validatedData.shortDescription || null,
        overview: validatedData.overview || null,
        base_price: validatedData.basePrice,
        form_type: validatedData.formType,
        is_active: validatedData.isActive,
        in_stock: validatedData.inStock,
        stock_status: validatedData.stockStatus,
        min_order_quantity: validatedData.minOrderQuantity,
        rush_eligible: validatedData.rushEligible,
        badge: validatedData.badge || null,
        display_order: validatedData.displayOrder,
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
          { error: "Product not found" },
          { status: 404 }
        );
      }
      console.error("[CMS PRODUCTS PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update product", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRODUCTS PUT] Unexpected error:", error);
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

    const { data: product, error } = await supabaseAdmin
      .from("products")
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
          { error: "Product not found" },
          { status: 404 }
        );
      }
      console.error("[CMS PRODUCTS DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to deactivate product", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product deactivated",
    });
  } catch (error) {
    console.error("[CMS PRODUCTS DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

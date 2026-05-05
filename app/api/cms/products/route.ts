import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { z } from "zod";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  category_id: z.string().uuid("Please select a category"),
  base_price: z.number().min(0, "Price must be positive"),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  overview: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock_status: z.enum([
    "in_stock",
    "low_stock",
    "out_of_stock",
    "made_to_order",
  ]),
  form_type: z.string().default("paper"),
  min_order_quantity: z.number().min(1).default(1),
  rush_eligible: z.boolean().default(true),
  quantity_thresholds: z.any().optional().nullable(),
  badge: z.string().optional().nullable(),
  currency: z.string().default("ETB"),
  is_active: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert({
        name: validatedData.name,
        slug: validatedData.slug,
        category_id: validatedData.category_id,
        base_price: validatedData.base_price,
        short_description: validatedData.short_description,
        description: validatedData.description,
        overview: validatedData.overview,
        sku: validatedData.sku,
        stock_status: validatedData.stock_status,
        form_type: validatedData.form_type,
        min_order_quantity: validatedData.min_order_quantity,
        rush_eligible: validatedData.rush_eligible,
        quantity_thresholds: validatedData.quantity_thresholds,
        badge: validatedData.badge,
        currency: validatedData.currency,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS PRODUCTS POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create product", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRODUCTS POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = productSchema.parse(body);

    if (!validatedData.id) {
      return NextResponse.json(
        { error: "Product ID is required for updates" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update({
        name: validatedData.name,
        slug: validatedData.slug,
        category_id: validatedData.category_id,
        base_price: validatedData.base_price,
        short_description: validatedData.short_description,
        description: validatedData.description,
        overview: validatedData.overview,
        sku: validatedData.sku,
        stock_status: validatedData.stock_status,
        form_type: validatedData.form_type,
        min_order_quantity: validatedData.min_order_quantity,
        rush_eligible: validatedData.rush_eligible,
        quantity_thresholds: validatedData.quantity_thresholds,
        badge: validatedData.badge,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validatedData.id)
      .select()
      .single();

    if (error) {
      console.error("[CMS PRODUCTS PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update product", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
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

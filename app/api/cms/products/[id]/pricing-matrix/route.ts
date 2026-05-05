import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { pricingMatrixEntrySchema } from "@/lib/validations/cms";
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

    const { data: entries, error } = await supabaseAdmin
      .from("product_pricing_matrix")
      .select("*")
      .eq("product_id", id)
      .order("matrix_key", { ascending: true });

    if (error) {
      console.error("[CMS PRICING-MATRIX GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch pricing matrix", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error("[CMS PRICING-MATRIX GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const validatedData = pricingMatrixEntrySchema.parse({
      ...body,
      product_id: id,
    });

    const { data: entry, error } = await supabaseAdmin
      .from("product_pricing_matrix")
      .insert({
        product_id: id,
        matrix_key: validatedData.matrix_key,
        matrix_label: validatedData.matrix_label || null,
        price: validatedData.price,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS PRICING-MATRIX POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create pricing matrix entry", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRICING-MATRIX POST] Unexpected error:", error);
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
      .from("product_pricing_matrix")
      .delete()
      .eq("product_id", id);

    if (error) {
      console.error("[CMS PRICING-MATRIX DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete pricing matrix entries", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "All pricing matrix entries deleted for product",
    });
  } catch (error) {
    console.error("[CMS PRICING-MATRIX DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { pricingMatrixBulkImportSchema } from "@/lib/validations/cms";
import { z } from "zod";

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
    const validatedData = pricingMatrixBulkImportSchema.parse({
      ...body,
      product_id: id,
    });

    const { error: deleteError } = await supabaseAdmin
      .from("product_pricing_matrix")
      .delete()
      .eq("product_id", id);

    if (deleteError) {
      console.error("[CMS PRICING-MATRIX BULK] Error deleting existing entries:", deleteError);
      return NextResponse.json(
        { error: "Failed to clear existing pricing matrix", details: deleteError.message },
        { status: 500 }
      );
    }

    if (validatedData.entries.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "All pricing matrix entries cleared",
      });
    }

    const rows = validatedData.entries.map((entry) => ({
      product_id: id,
      matrix_key: entry.matrix_key,
      matrix_label: entry.matrix_label || null,
      price: entry.price,
      is_active: entry.is_active,
    }));

    const { data: entries, error: insertError } = await supabaseAdmin
      .from("product_pricing_matrix")
      .insert(rows)
      .select();

    if (insertError) {
      console.error("[CMS PRICING-MATRIX BULK] Error inserting entries:", insertError);
      return NextResponse.json(
        { error: "Failed to import pricing matrix entries", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entries,
      message: `${entries.length} pricing matrix entries imported`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRICING-MATRIX BULK] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

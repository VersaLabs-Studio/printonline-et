import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { designerFeeTierSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; tierId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, tierId } = await params;
    const body = await req.json();
    const validatedData = designerFeeTierSchema.parse({
      ...body,
      product_id: id,
    });

    const { data: tier, error } = await supabaseAdmin
      .from("designer_fee_tiers")
      .update({
        min_quantity: validatedData.min_quantity,
        max_quantity: validatedData.max_quantity ?? null,
        fee_amount: validatedData.fee_amount,
        label: validatedData.label || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .eq("id", tierId)
      .eq("product_id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Designer fee tier not found" },
          { status: 404 }
        );
      }
      console.error("[CMS DESIGNER-FEES PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update designer fee tier", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: tier });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS DESIGNER-FEES PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; tierId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, tierId } = await params;

    const { error } = await supabaseAdmin
      .from("designer_fee_tiers")
      .delete()
      .eq("id", tierId)
      .eq("product_id", id);

    if (error) {
      console.error("[CMS DESIGNER-FEES DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete designer fee tier", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Designer fee tier deleted" });
  } catch (error) {
    console.error("[CMS DESIGNER-FEES DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

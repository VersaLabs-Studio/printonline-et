import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { designerFeeTierSchema } from "@/lib/validations/cms";
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

    const { data: tiers, error } = await supabaseAdmin
      .from("designer_fee_tiers")
      .select("*")
      .eq("product_id", id)
      .order("min_quantity", { ascending: true });

    if (error) {
      console.error("[CMS DESIGNER-FEES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch designer fee tiers", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: tiers });
  } catch (error) {
    console.error("[CMS DESIGNER-FEES GET] Unexpected error:", error);
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
    const validatedData = designerFeeTierSchema.parse({
      ...body,
      product_id: id,
    });

    const { data: tier, error } = await supabaseAdmin
      .from("designer_fee_tiers")
      .insert({
        product_id: id,
        min_quantity: validatedData.min_quantity,
        max_quantity: validatedData.max_quantity ?? null,
        fee_amount: validatedData.fee_amount,
        label: validatedData.label || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS DESIGNER-FEES POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create designer fee tier", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: tier }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS DESIGNER-FEES POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

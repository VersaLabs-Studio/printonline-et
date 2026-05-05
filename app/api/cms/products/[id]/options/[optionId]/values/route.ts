import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { productOptionValueSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { optionId } = await params;

    const { data: values, error } = await supabaseAdmin
      .from("product_option_values")
      .select("*")
      .eq("option_id", optionId)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS OPTION VALUES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch option values", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: values });
  } catch (error) {
    console.error("[CMS OPTION VALUES GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { optionId } = await params;
    const body = await req.json();
    const validatedData = productOptionValueSchema.parse(body);

    const { data: value, error } = await supabaseAdmin
      .from("product_option_values")
      .insert({
        option_id: optionId,
        value: validatedData.value,
        label: validatedData.label,
        price_amount: validatedData.priceAmount ?? null,
        price_type: validatedData.priceType,
        group_name: validatedData.groupName || null,
        description: validatedData.description || null,
        display_order: validatedData.displayOrder,
        is_default: validatedData.isDefault,
        is_active: validatedData.isActive,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS OPTION VALUES POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create option value", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: value }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS OPTION VALUES POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

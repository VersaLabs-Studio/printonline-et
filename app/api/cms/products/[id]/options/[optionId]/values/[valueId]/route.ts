import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { productOptionValueSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; optionId: string; valueId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { valueId } = await params;
    const body = await req.json();
    const validatedData = productOptionValueSchema.parse(body);

    const { data: value, error } = await supabaseAdmin
      .from("product_option_values")
      .update({
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
      .eq("id", valueId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Option value not found" },
          { status: 404 }
        );
      }
      console.error("[CMS OPTION VALUES PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update option value", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: value });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS OPTION VALUES PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; optionId: string; valueId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { valueId } = await params;

    const { error } = await supabaseAdmin
      .from("product_option_values")
      .delete()
      .eq("id", valueId);

    if (error) {
      console.error("[CMS OPTION VALUES DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete option value", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Option value deleted" });
  } catch (error) {
    console.error("[CMS OPTION VALUES DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

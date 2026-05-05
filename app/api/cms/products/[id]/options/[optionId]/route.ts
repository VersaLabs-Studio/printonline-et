import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { productOptionSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function PUT(
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
    const validatedData = productOptionSchema.parse(body);

    const { data: option, error } = await supabaseAdmin
      .from("product_options")
      .update({
        option_key: validatedData.optionKey,
        option_label: validatedData.optionLabel,
        field_type: validatedData.fieldType,
        is_required: validatedData.isRequired,
        display_order: validatedData.displayOrder,
        description: validatedData.description || null,
        group_label: validatedData.groupLabel || null,
        depends_on_option: validatedData.dependsOnOption || null,
        depends_on_value: validatedData.dependsOnValue || null,
      })
      .eq("id", optionId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Product option not found" },
          { status: 404 }
        );
      }
      console.error("[CMS PRODUCT OPTIONS PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update product option", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: option });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRODUCT OPTIONS PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { error: valuesError } = await supabaseAdmin
      .from("product_option_values")
      .delete()
      .eq("option_id", optionId);

    if (valuesError) {
      console.error("[CMS PRODUCT OPTIONS DELETE] Error deleting values:", valuesError);
      return NextResponse.json(
        { error: "Failed to delete option values", details: valuesError.message },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from("product_options")
      .delete()
      .eq("id", optionId);

    if (error) {
      console.error("[CMS PRODUCT OPTIONS DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete product option", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Product option deleted" });
  } catch (error) {
    console.error("[CMS PRODUCT OPTIONS DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

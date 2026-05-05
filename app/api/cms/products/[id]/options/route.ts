import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { productOptionSchema } from "@/lib/validations/cms";
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

    const { data: options, error } = await supabaseAdmin
      .from("product_options")
      .select("*, product_option_values(*)")
      .eq("product_id", id)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS PRODUCT OPTIONS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch product options", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    console.error("[CMS PRODUCT OPTIONS GET] Unexpected error:", error);
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
    const validatedData = productOptionSchema.parse(body);

    const { data: option, error } = await supabaseAdmin
      .from("product_options")
      .insert({
        product_id: id,
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
      .select()
      .single();

    if (error) {
      console.error("[CMS PRODUCT OPTIONS POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create product option", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: option }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRODUCT OPTIONS POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

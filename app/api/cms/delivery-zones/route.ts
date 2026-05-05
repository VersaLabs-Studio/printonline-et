import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { deliveryZoneSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: zones, error } = await supabaseAdmin
      .from("delivery_zones")
      .select("*, delivery_quantity_tiers(*)")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS DELIVERY-ZONES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch delivery zones", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: zones });
  } catch (error) {
    console.error("[CMS DELIVERY-ZONES GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = deliveryZoneSchema.parse(body);

    const { data: zone, error } = await supabaseAdmin
      .from("delivery_zones")
      .insert({
        sub_city: validatedData.sub_city,
        base_fee: validatedData.base_fee,
        description: validatedData.description || null,
        zone_label: validatedData.zone_label || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS DELIVERY-ZONES POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create delivery zone", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: zone }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS DELIVERY-ZONES POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

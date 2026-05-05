import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { deliveryZoneSchema } from "@/lib/validations/cms";
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

    const { data: zone, error } = await supabaseAdmin
      .from("delivery_zones")
      .select("*, delivery_quantity_tiers(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Delivery zone not found" },
          { status: 404 }
        );
      }
      console.error("[CMS DELIVERY-ZONES GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch delivery zone", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: zone });
  } catch (error) {
    console.error("[CMS DELIVERY-ZONES GET ONE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const validatedData = deliveryZoneSchema.parse(body);

    const { data: zone, error } = await supabaseAdmin
      .from("delivery_zones")
      .update({
        sub_city: validatedData.sub_city,
        base_fee: validatedData.base_fee,
        description: validatedData.description || null,
        zone_label: validatedData.zone_label || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Delivery zone not found" },
          { status: 404 }
        );
      }
      console.error("[CMS DELIVERY-ZONES PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update delivery zone", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: zone });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS DELIVERY-ZONES PUT] Unexpected error:", error);
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

    const { error: tiersError } = await supabaseAdmin
      .from("delivery_quantity_tiers")
      .delete()
      .eq("zone_id", id);

    if (tiersError) {
      console.error("[CMS DELIVERY-ZONES DELETE] Error deleting tiers:", tiersError);
      return NextResponse.json(
        { error: "Failed to delete delivery zone tiers", details: tiersError.message },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from("delivery_zones")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[CMS DELIVERY-ZONES DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete delivery zone", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Delivery zone deleted" });
  } catch (error) {
    console.error("[CMS DELIVERY-ZONES DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

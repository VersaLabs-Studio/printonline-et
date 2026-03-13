import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if ID is a UUID or an order number (starts with POL-)
    const isOrderNumber = id.startsWith("POL-");

    const query = supabaseAdmin
      .from("orders")
      .select("*, order_items(*, order_item_design_assets(*))");

    if (isOrderNumber) {
      query.eq("order_number", id);
    } else {
      query.eq("id", id);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { data: customerProfile } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", session.user.id)
      .single();

    // Check ownership. Bypass if user role is admin.
    if (
      order.customer_id !== customerProfile?.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "ready",
    "delivered",
    "completed",
    "cancelled",
  ]),
  note: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, note } = updateStatusSchema.parse(body);

    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("status_history")
      .eq("id", id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentHistory = Array.isArray(order.status_history)
      ? order.status_history
      : [];
    const newHistory = [
      ...currentHistory,
      {
        status,
        timestamp: new Date().toISOString(),
        by: session.user.email,
        note: note || `Status updated to ${status}`,
      },
    ];

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        status_history: newHistory as any,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

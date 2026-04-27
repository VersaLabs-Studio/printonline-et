import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { chapa } from "@/lib/chapa";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // Fetch order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify ownership
    const { data: customerProfile } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", session.user.id)
      .single();

    if (order.customer_id !== customerProfile?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow retry if payment is pending or failed
    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    // Generate new tx_ref
    const timestamp = Date.now();
    const tx_ref = `POL-${order.id.slice(0, 8)}-${timestamp}`;

    // Split name for Chapa
    const nameParts = (order.customer_name || "Customer").trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "System";

    const chapaResponse = await chapa.initialize({
      amount: order.total_amount.toString(),
      currency: "ETB",
      email: order.customer_email,
      first_name: firstName,
      last_name: lastName,
      tx_ref,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?tx_ref=${tx_ref}`,
      customization: {
        title: "PrintOnline.et",
        description: `Payment for Order ${order.order_number}`,
      },
    });

    // Update order with new tx_ref
    await supabaseAdmin
      .from("orders")
      .update({ tx_ref })
      .eq("id", order.id);

    return NextResponse.json(
      { success: true, checkout_url: chapaResponse.data.checkout_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/payments/retry] Error:", error);
    return NextResponse.json(
      { error: "Payment retry failed" },
      { status: 500 }
    );
  }
}

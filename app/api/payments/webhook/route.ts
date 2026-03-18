import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Chapa Webhook Received:", body);

    const { tx_ref, status } = body;

    if (!tx_ref) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    if (status === "success") {
      // 1. Fetch Order
      const { data: order, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("id, status, payment_status, status_history")
        .eq("tx_ref", tx_ref)
        .single();

      if (fetchError || !order) {
        console.error("Webhook Order Not Found:", tx_ref);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 2. Idempotency Check
      if (order.payment_status === "paid") {
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      // 3. Update Order
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          payment_completed_at: new Date().toISOString(),
          status_history: [
            ...(Array.isArray(order.status_history) ? order.status_history : []),
            {
              status: "confirmed",
              timestamp: new Date().toISOString(),
              note: "Payment confirmed via Webhook",
            },
          ],
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Webhook Update Error:", updateError);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: "No action taken for status: " + status });

  } catch (error) {
    console.error("Webhook API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

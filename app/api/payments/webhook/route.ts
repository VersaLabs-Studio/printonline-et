import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { emailTemplatePaymentFailed } from "@/lib/email-templates/payment-failed";

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
          status: "order_confirmed",
          payment_completed_at: new Date().toISOString(),
          payment_receipt: body, // Store full webhook payload as receipt
          status_history: [
            ...(Array.isArray(order.status_history) ? order.status_history : []),
            {
              status: "order_confirmed",
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

    // Handle payment failures
    if (status === "failed" || status === "cancelled") {
      // 1. Fetch Order with items
      const { data: order, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select(`
          id, 
          order_number,
          status, 
          payment_status, 
          status_history,
          customer_name,
          customer_email,
          total_amount,
          order_items (
            product_name,
            quantity,
            line_total
          )
        `)
        .eq("tx_ref", tx_ref)
        .single();

      if (fetchError || !order) {
        console.error("Webhook Order Not Found:", tx_ref);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 2. Update Order status to payment_failed
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          status_history: [
            ...(Array.isArray(order.status_history) ? order.status_history : []),
            {
              status: "payment_failed",
              timestamp: new Date().toISOString(),
              note: `Payment ${status} via Webhook`,
            },
          ],
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Webhook Update Error:", updateError);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }

      // 3. Send payment failed email
      try {
        const retryLink = `${process.env.NEXT_PUBLIC_APP_URL}/order-summary?step=3`;
        const emailHtml = emailTemplatePaymentFailed(
          {
            order_number: order.order_number,
            total_amount: order.total_amount,
            items: order.order_items,
          },
          order.customer_name,
          retryLink,
        );

        await sendEmail({
          to: order.customer_email,
          subject: `Payment Issue - Order ${order.order_number}`,
          html: emailHtml,
        });

        console.log("Payment failed email sent for order:", order.order_number);
      } catch (emailError) {
        console.error("Failed to send payment failed email:", emailError);
        // Don't fail the webhook if email fails
      }

      return NextResponse.json({ success: true, message: "Payment failure recorded" });
    }

    return NextResponse.json({ success: true, message: "No action taken for status: " + status });

  } catch (error) {
    console.error("Webhook API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

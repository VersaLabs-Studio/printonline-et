import { NextResponse } from "next/server";
import { chapa } from "@/lib/chapa";
import type { ChapaVerifyResponse } from "@/lib/chapa";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { emailTemplateOrderConfirmation } from "@/lib/email-templates/order-confirmation";
import { emailTemplateAdminNewOrder } from "@/lib/email-templates/admin-new-order";

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get("tx_ref");

    if (!tx_ref) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    // 1. Check if already verified in our DB (Idempotency)
    const { data: existingOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        payment_provider,
        payment_completed_at,
        total_amount,
        subtotal,
        delivery_fee,
        tax_amount,
        currency,
        customer_name,
        customer_email,
        customer_phone,
        customer_tin,
        delivery_address,
        delivery_city,
        delivery_sub_city,
        special_instructions,
        created_at,
        order_items (
          id,
          product_id,
          product_name,
          product_slug,
          product_image,
          category,
          unit_price,
          quantity,
          line_total,
          selected_options,
          design_preference,
          design_file_url,
          design_file_name
        )
      `)
      .eq("tx_ref", tx_ref)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.payment_status === "paid") {
      return NextResponse.json({ 
        success: true, 
        message: "Payment already verified",
        order: existingOrder 
      });
    }

    // 2. Verify with Chapa
    const verification = await chapa.verify(tx_ref);

    if (verification.status === "success" && verification.data.status === "success") {
      // 3. Update Order in DB with receipt data
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "order_confirmed",
          payment_completed_at: new Date().toISOString(),
          payment_receipt: verification.data as ChapaVerifyResponse["data"],
          status_history: [
            ...((existingOrder.status_history as StatusHistoryEntry[] | null) || []),
            {
              status: "order_confirmed",
              timestamp: new Date().toISOString(),
              note: "Payment verified via Chapa",
            },
          ],
        })
        .eq("id", existingOrder.id)
        .select()
        .single();

      if (updateError) {
        console.error("Order Update Error:", updateError);
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
      }

      // Fetch complete order with items after update
      const { data: completeOrder } = await supabaseAdmin
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_slug,
            product_image,
            category,
            unit_price,
            quantity,
            line_total,
            selected_options,
            design_preference,
            design_file_url,
            design_file_name
          )
        `)
        .eq("id", existingOrder.id)
        .single();

      // Send order confirmation emails (server-side, fire-and-forget)
      const orderData = completeOrder || updatedOrder;
      if (orderData) {
        // Customer confirmation email
        sendEmail({
          to: orderData.customer_email,
          subject: `Order Confirmed - #${orderData.order_number}`,
          html: emailTemplateOrderConfirmation(
            {
              order_number: orderData.order_number,
              status: orderData.status,
              items: (orderData.order_items || []).map((item: Record<string, unknown>) => ({
                product_name: item.product_name as string,
                quantity: item.quantity as number,
                line_total: item.line_total as number,
                selected_options: item.selected_options as Record<string, string> | undefined,
                design_preference: item.design_preference as string | undefined,
              })),
              subtotal: orderData.subtotal,
              delivery_fee: orderData.delivery_fee,
              total_amount: orderData.total_amount,
            },
            orderData.customer_name
          ),
        }).catch((err) => console.error("[PAYMENT VERIFY] Customer email failed:", err));

        // Admin notification email
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ORDER_NOTIFICATION_EMAIL;
        if (adminEmail) {
          sendEmail({
            to: adminEmail,
            subject: `New Order - #${orderData.order_number}`,
            html: emailTemplateAdminNewOrder({
              order_number: orderData.order_number,
              customer_name: orderData.customer_name,
              customer_email: orderData.customer_email,
              customer_phone: orderData.customer_phone,
              total_amount: orderData.total_amount,
              currency: orderData.currency,
              items: (orderData.order_items || []).map((item: Record<string, unknown>) => ({
                product_name: item.product_name as string,
                quantity: item.quantity as number,
                unit_price: item.unit_price as number,
                total_price: item.line_total as number,
              })),
              created_at: orderData.created_at,
            }),
          }).catch((err) => console.error("[PAYMENT VERIFY] Admin email failed:", err));
        }
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        order: orderData,
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed",
        details: verification.data.status 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

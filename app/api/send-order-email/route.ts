import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  emailTemplateOrderConfirmation,
  emailTemplateOrderStatusUpdate,
} from "@/lib/email-template";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const sendEmailSchema = z.object({
  type: z.enum(["order_confirmation", "status_update"]),
  order_id: z.string().uuid(),
  // For update flow
  status: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, order_id, status, note } = sendEmailSchema.parse(body);

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let emailSent = false;

    if (type === "order_confirmation") {
      const html = emailTemplateOrderConfirmation(
        {
          order_number: order.order_number,
          status: order.status,
          items: order.order_items,
          subtotal: order.subtotal,
          total_amount: order.total_amount,
        },
        order.customer_name,
      );

      // Send to customer
      await sendEmail({
        to: order.customer_email,
        subject: `Your PrintOnline.et Order Confirmation - ${order.order_number}`,
        html,
      });

      // Send to admin
      await sendEmail({
        to: process.env.ORDER_NOTIFICATION_EMAIL || "order@printonline.et",
        subject: `New Order Received - ${order.order_number}`,
        html,
      });

      // Update confirmation_email_sent flag
      await supabaseAdmin
        .from("orders")
        .update({ confirmation_email_sent: true })
        .eq("id", order.id);

      emailSent = true;
    } else if (type === "status_update" && status) {
      const html = emailTemplateOrderStatusUpdate(
        order.order_number,
        status,
        note,
      );
      await sendEmail({
        to: order.customer_email,
        subject: `Update on your PrintOnline.et Order - ${order.order_number}`,
        html,
      });
      emailSent = true;
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    console.error("POST /api/send-order-email error:", error);
    return NextResponse.json(
      { error: "Email dispatch failed" },
      { status: 500 },
    );
  }
}

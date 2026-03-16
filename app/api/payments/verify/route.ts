import { NextResponse } from "next/server";
import { chapa } from "@/lib/chapa";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
      .select("id, status, payment_status, total_amount")
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
      // 3. Update Order in DB
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "order_confirmed",
          payment_completed_at: new Date().toISOString(),
          status_history: [
            ...((existingOrder as any).status_history || []),
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

      return NextResponse.json({ 
        success: true, 
        message: "Payment verified successfully",
        order: updatedOrder 
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

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";
import { chapa } from "@/lib/chapa";
import { calculateDeliveryFee, FREE_DELIVERY_THRESHOLD } from "@/lib/delivery/calculator";

const orderItemSchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  product_name: z.string(),
  product_slug: z.string().optional().nullable(),
  product_image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  unit_price: z.number(),
  quantity: z.number(),
  line_total: z.number(),
  selected_options: z.record(z.any()).optional().nullable(),
  design_preference: z.enum(["upload", "hire_designer"]).default("upload"),
  design_file_url: z.string().optional().nullable(),
  design_file_name: z.string().optional().nullable(),
  design_file_size: z.number().optional().nullable(),
  assets: z.array(z.object({
    file_url: z.string(),
    file_name: z.string(),
    file_size: z.number().optional().nullable(),
  })).optional(),
});

const createOrderSchema = z.object({
  customer_name: z.string(),
  customer_email: z.string().email(),
  customer_phone: z.string().optional().nullable(),
  customer_tin: z.string().optional().nullable(),
  delivery_address: z.string().optional().nullable(),
  delivery_city: z.string().optional().nullable(),
  delivery_sub_city: z.string().optional().nullable(),
  status: z.string().default("pending"),
  subtotal: z.number(),
  delivery_fee: z.number().default(0),
  tax_amount: z.number().default(0),
  total_amount: z.number(),
  currency: z.string().default("ETB"),
  special_instructions: z.string().optional().nullable(),
  terms_accepted: z
    .boolean()
    .refine((val) => val === true, "Must accept terms"),
  payment_method: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    const { data: customerProfile } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    const calculatedDeliveryFee = validatedData.delivery_address === "PrintOnline HQ (Pickup)"
      ? 0
      : validatedData.subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : calculateDeliveryFee({
          subCity: validatedData.delivery_sub_city || null,
          cartTotal: validatedData.subtotal,
          totalQuantity: validatedData.items.reduce((sum, item) => sum + item.quantity, 0),
          deliveryMethod: "home",
        }).finalFee;

    const totalAmount = validatedData.subtotal + calculatedDeliveryFee;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customerProfile?.id || null, 
        order_number: "", 
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email,
        customer_phone: validatedData.customer_phone,
        customer_tin: validatedData.customer_tin,
        delivery_address: validatedData.delivery_address,
        delivery_city: validatedData.delivery_city,
        delivery_sub_city: validatedData.delivery_sub_city,
        status: "pending",
        payment_status: "pending_payment",
        payment_provider: "chapa",
        subtotal: validatedData.subtotal,
        delivery_fee: calculatedDeliveryFee,
        tax_amount: validatedData.tax_amount,
        total_amount: totalAmount,
        currency: validatedData.currency,
        special_instructions: validatedData.special_instructions,
        terms_accepted: validatedData.terms_accepted,
        terms_accepted_at: new Date().toISOString(),
        status_history: [
          {
            status: "pending",
            timestamp: new Date().toISOString(),
            note: "Order initiated, awaiting payment",
          },
        ],
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation failed", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    // Insert items one by one to handle asset relations safely or use select() on bulk
    for (const item of validatedData.items) {
      const { data: orderItem, error: itemError } = await supabaseAdmin
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_slug: item.product_slug,
          product_image: item.product_image,
          category: item.category,
          unit_price: item.unit_price,
          quantity: item.quantity,
          line_total: item.line_total,
          selected_options: item.selected_options,
          design_preference: item.design_preference,
          design_file_url: item.design_file_url,
          design_file_name: item.design_file_name,
          design_file_size: item.design_file_size,
        })
        .select()
        .single();

      if (itemError || !orderItem) {
        console.error("Order item creation failed", itemError);
        continue;
      }

      // Insert assets if any
      if (item.assets && item.assets.length > 0) {
        const assetsToInsert = item.assets.map(asset => ({
          order_item_id: orderItem.id,
          file_url: asset.file_url,
          file_name: asset.file_name,
          file_size: asset.file_size,
        }));

        const { error: assetsError } = await supabaseAdmin
          .from("order_item_design_assets")
          .insert(assetsToInsert);

        if (assetsError) {
          console.error("Assets insertion failed", assetsError);
        }
      }
    }

    // 2. Initialize Chapa Payment
    const timestamp = Date.now();
    // Chapa tx_ref limit is 50 chars. POL-TXN (7) + UUID-prefix (8) + Timestamp (13) + separators = ~30 chars
    const tx_ref = `POL-${order.id.slice(0, 8)}-${timestamp}`;
    
    // Split name for Chapa (Simple split, can be improved)
    const nameParts = validatedData.customer_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "System";

    try {
      const chapaResponse = await chapa.initialize({
        amount: totalAmount.toString(),
        currency: "ETB",
        email: validatedData.customer_email,
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

      // 3. Update order with tx_ref
      await supabaseAdmin
        .from("orders")
        .update({ tx_ref })
        .eq("id", order.id);

      return NextResponse.json({ 
        success: true, 
        order,
        checkout_url: chapaResponse.data.checkout_url 
      }, { status: 201 });

    } catch (chapaError) {
      console.error("Chapa Initialization Error:", chapaError);
      // Even if payment init fails, the order is created. 
      // We return it so the frontend can handle the retry or failure and show the order summary.
      return NextResponse.json({ 
        success: false, 
        order,
        error: "Payment initialization failed"
      }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    console.error("POST /api/orders error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: customerProfile } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!customerProfile) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_number, created_at, status, total_amount, payment_status",
      )
      .eq("customer_id", customerProfile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const attachmentSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
  category: z.enum(["image", "video", "document"]),
});

const sendMessageSchema = z.object({
  senderId: z.string().min(1),
  recipientId: z.string().min(1),
  orderId: z.string().optional(),
  message: z.string().min(0).max(2000),
  isAdmin: z.boolean().default(false),
  attachments: z.array(attachmentSchema).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[GET /api/messages] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/messages] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = sendMessageSchema.parse(body);

    // Security: ensure senderId matches the authenticated user
    if (validated.senderId !== session.user.id) {
      return NextResponse.json(
        { error: "Sender ID does not match authenticated user" },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert({
        sender_id: validated.senderId,
        recipient_id: validated.recipientId,
        order_id: validated.orderId || null,
        message: validated.message,
        is_admin: validated.isAdmin,
        attachments: validated.attachments || [],
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/messages] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[POST /api/messages] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

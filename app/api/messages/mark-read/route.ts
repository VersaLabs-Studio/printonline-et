import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const markReadSchema = z.object({
  orderId: z.string().min(1),
  userId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = markReadSchema.parse(body);

    // Security: user can only mark messages as read for themselves
    if (validated.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Cannot mark messages as read for another user" },
        { status: 403 }
      );
    }

    const { error } = await supabaseAdmin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("order_id", validated.orderId)
      .eq("recipient_id", validated.userId)
      .is("read_at", null);

    if (error) {
      console.error("[POST /api/messages/mark-read] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[POST /api/messages/mark-read] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateUserRole } from "@/lib/queries/users";
import { isAdmin } from "@/lib/permissions";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["admin", "customer"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: targetUserId } = await params;
    const body = await req.json();
    const { role } = updateRoleSchema.parse(body);

    // Prevent de-promoting the last admin (logic simplified for now)
    // In a real app, we'd check if targetUserId is the ONLY admin.

    const updatedUser = await updateUserRole(targetUserId, role);

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("[API PATCH /api/cms/users] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password must be at most 128 characters"),
});

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { current_password, new_password } = changePasswordSchema.parse(body);

    const result = await auth.api.changePassword({
      body: {
        currentPassword: current_password,
        newPassword: new_password,
      },
      headers: await headers(),
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to change password", details: "Current password may be incorrect" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.toLowerCase().includes("incorrect") ||
      errorMessage.toLowerCase().includes("invalid") ||
      errorMessage.toLowerCase().includes("wrong")
    ) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    console.error("[ACCOUNT PASSWORD PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { emailTemplateAccountDeletion } from "@/lib/email-templates/account-deletion";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: customerProfile, error: profileError } = await supabaseAdmin
      .from("customer_profiles")
      .select("id, full_name, email, is_active")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !customerProfile) {
      console.error("[DELETE_ACCOUNT] Failed to fetch profile:", profileError);
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    if (!customerProfile.is_active) {
      return NextResponse.json(
        { error: "Account is already deactivated" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("customer_profiles")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", user.id);

    if (updateError) {
      console.error("[DELETE_ACCOUNT] Failed to deactivate profile:", updateError);
      return NextResponse.json(
        { error: "Failed to deactivate account" },
        { status: 500 }
      );
    }

    try {
      await sendEmail({
        to: customerProfile.email,
        subject: "Account Deletion Confirmed - PrintOnline.et",
        html: emailTemplateAccountDeletion(customerProfile.full_name),
      });
    } catch (emailError) {
      console.error("[DELETE_ACCOUNT] Failed to send deletion email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Account deactivated successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("[DELETE_ACCOUNT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

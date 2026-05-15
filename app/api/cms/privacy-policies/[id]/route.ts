import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { privacyPolicySchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: policy, error } = await supabaseAdmin
      .from("privacy_policies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Privacy policy not found" },
          { status: 404 }
        );
      }
      console.error("[CMS PRIVACY-POLICIES GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch privacy policy", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: policy });
  } catch (error) {
    console.error("[CMS PRIVACY-POLICIES GET ONE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { id } = await params;
    const body = await req.json();
    const validatedData = privacyPolicySchema.parse(body);

    const { data: policy, error } = await supabaseAdmin
      .from("privacy_policies")
      .update({
        title: validatedData.title,
        content: validatedData.content,
        policy_type: validatedData.policy_type,
        version: validatedData.version,
        is_active: validatedData.is_active,
        effective_date: validatedData.effective_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Privacy policy not found" },
          { status: 404 }
        );
      }
      console.error("[CMS PRIVACY-POLICIES PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update privacy policy", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: policy });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRIVACY-POLICIES PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("privacy_policies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[CMS PRIVACY-POLICIES DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete privacy policy", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Privacy policy deleted" });
  } catch (error) {
    console.error("[CMS PRIVACY-POLICIES DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

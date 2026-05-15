import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { privacyPolicySchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: policies, error } = await supabaseAdmin
      .from("privacy_policies")
      .select("*")
      .order("policy_type", { ascending: true });

    if (error) {
      console.error("[CMS PRIVACY-POLICIES GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch privacy policies", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: policies });
  } catch (error) {
    console.error("[CMS PRIVACY-POLICIES GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = privacyPolicySchema.parse(body);

    const { data: policy, error } = await supabaseAdmin
      .from("privacy_policies")
      .insert({
        title: validatedData.title,
        content: validatedData.content,
        policy_type: validatedData.policy_type,
        version: validatedData.version,
        is_active: validatedData.is_active,
        effective_date: validatedData.effective_date || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS PRIVACY-POLICIES POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create privacy policy", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: policy }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS PRIVACY-POLICIES POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

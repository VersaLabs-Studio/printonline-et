import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { z } from "zod";

const updateSettingSchema = z.object({
  setting_key: z.string().min(1, "Setting key is required"),
  setting_value: z.any(),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: settings, error } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .order("category", { ascending: true })
      .order("setting_key", { ascending: true });

    if (error) {
      console.error("[CMS SETTINGS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch settings", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[CMS SETTINGS GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { setting_key, setting_value } = updateSettingSchema.parse(body);

    const { data: setting, error } = await supabaseAdmin
      .from("site_settings")
      .update({
        setting_value,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", setting_key)
      .select()
      .single();

    if (error) {
      console.error("[CMS SETTINGS PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update setting", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS SETTINGS PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

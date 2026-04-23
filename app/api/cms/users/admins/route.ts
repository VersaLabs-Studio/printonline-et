import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all admin users from the user table
    const { data: adminUsers, error } = await supabaseAdmin
      .from("user" as any)
      .select("id, name, email, role")
      .eq("role", "admin")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[API GET /api/cms/users/admins] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch admin users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ admins: adminUsers || [] }, { status: 200 });
  } catch (error) {
    console.error("[API GET /api/cms/users/admins] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

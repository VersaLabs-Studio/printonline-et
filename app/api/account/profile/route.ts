import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      full_name,
      phone,
      tin_number,
      company_name,
      address_line1,
      address_line2,
      city,
      sub_city,
      woreda,
    } = body;

    const { data: existing } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", session.user.id)
      .single();

    let result;
    if (existing) {
      result = await supabaseAdmin
        .from("customer_profiles")
        .update({
          full_name,
          phone,
          tin_number,
          company_name,
          address_line1,
          address_line2,
          city,
          sub_city,
          woreda,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", session.user.id)
        .select()
        .single();
    } else {
      result = await supabaseAdmin
        .from("customer_profiles")
        .insert({
          auth_user_id: session.user.id,
          full_name,
          phone,
          tin_number,
          company_name,
          address_line1,
          address_line2,
          city,
          sub_city,
          woreda,
          is_active: true,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Profile update error:", result.error);
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile: result.data });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

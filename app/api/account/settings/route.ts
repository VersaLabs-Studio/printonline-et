import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const updateProfileSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(200).optional(),
  phone: z.string().max(20).optional().nullable(),
  company_name: z.string().max(200).optional().nullable(),
  tin_number: z.string().max(50).optional().nullable(),
  address_line1: z.string().max(300).optional().nullable(),
  address_line2: z.string().max(300).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  sub_city: z.string().max(100).optional().nullable(),
  woreda: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabaseAdmin
      .from("customer_profiles")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from("customer_profiles")
          .insert({
            auth_user_id: session.user.id,
            full_name: session.user.name || "",
            email: session.user.email,
            is_active: true,
          })
          .select()
          .single();

        if (insertError) {
          console.error("[ACCOUNT SETTINGS GET] Error creating profile:", insertError);
          return NextResponse.json(
            { error: "Failed to create profile", details: insertError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, data: newProfile });
      }

      console.error("[ACCOUNT SETTINGS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("[ACCOUNT SETTINGS GET] Unexpected error:", error);
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

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.full_name !== undefined) updatePayload.full_name = validatedData.full_name;
    if (validatedData.phone !== undefined) updatePayload.phone = validatedData.phone;
    if (validatedData.company_name !== undefined) updatePayload.company_name = validatedData.company_name;
    if (validatedData.tin_number !== undefined) updatePayload.tin_number = validatedData.tin_number;
    if (validatedData.address_line1 !== undefined) updatePayload.address_line1 = validatedData.address_line1;
    if (validatedData.address_line2 !== undefined) updatePayload.address_line2 = validatedData.address_line2;
    if (validatedData.city !== undefined) updatePayload.city = validatedData.city;
    if (validatedData.sub_city !== undefined) updatePayload.sub_city = validatedData.sub_city;
    if (validatedData.woreda !== undefined) updatePayload.woreda = validatedData.woreda;
    if (validatedData.country !== undefined) updatePayload.country = validatedData.country;

    const { data: existing } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", session.user.id)
      .single();

    let result;
    if (existing) {
      result = await supabaseAdmin
        .from("customer_profiles")
        .update(updatePayload)
        .eq("auth_user_id", session.user.id)
        .select()
        .single();
    } else {
      result = await supabaseAdmin
        .from("customer_profiles")
        .insert({
          auth_user_id: session.user.id,
          full_name: validatedData.full_name || session.user.name || "",
          email: session.user.email,
          phone: validatedData.phone || null,
          company_name: validatedData.company_name || null,
          tin_number: validatedData.tin_number || null,
          address_line1: validatedData.address_line1 || null,
          address_line2: validatedData.address_line2 || null,
          city: validatedData.city || null,
          sub_city: validatedData.sub_city || null,
          woreda: validatedData.woreda || null,
          country: validatedData.country || null,
          is_active: true,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("[ACCOUNT SETTINGS PUT] Error:", result.error);
      return NextResponse.json(
        { error: "Failed to update profile", details: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[ACCOUNT SETTINGS PUT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { homepageTestimonialSchema } from "@/lib/validations/cms";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: testimonials, error } = await supabaseAdmin
      .from("homepage_testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[CMS TESTIMONIALS GET] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch testimonials", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("[CMS TESTIMONIALS GET] Unexpected error:", error);
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
    const validatedData = homepageTestimonialSchema.parse(body);

    const { data: testimonial, error } = await supabaseAdmin
      .from("homepage_testimonials")
      .insert({
        name: validatedData.name,
        role: validatedData.role || null,
        company: validatedData.company || null,
        avatar_url: validatedData.avatar_url || null,
        rating: validatedData.rating,
        quote: validatedData.quote,
        project: validatedData.project || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[CMS TESTIMONIALS POST] Error:", error);
      return NextResponse.json(
        { error: "Failed to create testimonial", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS TESTIMONIALS POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

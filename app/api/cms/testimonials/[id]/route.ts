import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";
import { homepageTestimonialSchema } from "@/lib/validations/cms";
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

    const { data: testimonial, error } = await supabaseAdmin
      .from("homepage_testimonials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }
      console.error("[CMS TESTIMONIALS GET ONE] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch testimonial", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("[CMS TESTIMONIALS GET ONE] Unexpected error:", error);
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
    const validatedData = homepageTestimonialSchema.parse(body);

    const { data: testimonial, error } = await supabaseAdmin
      .from("homepage_testimonials")
      .update({
        name: validatedData.name,
        role: validatedData.role || null,
        company: validatedData.company || null,
        avatar_url: validatedData.avatar_url || null,
        rating: validatedData.rating,
        quote: validatedData.quote,
        project: validatedData.project || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }
      console.error("[CMS TESTIMONIALS PUT] Error:", error);
      return NextResponse.json(
        { error: "Failed to update testimonial", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CMS TESTIMONIALS PUT] Unexpected error:", error);
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
      .from("homepage_testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[CMS TESTIMONIALS DELETE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete testimonial", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("[CMS TESTIMONIALS DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

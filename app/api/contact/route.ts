import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { contactFormSchema } from "@/lib/validations/cms";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactFormSchema.parse(body);

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Phone:</strong> ${validatedData.phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${validatedData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${validatedData.message}</p>
    `;

    const sent = await sendEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL || "admin@printonline.et",
      subject: `Contact Form: ${validatedData.subject}`,
      html: emailHtml,
    });

    if (!sent) {
      console.error("[CONTACT POST] Email failed to send");
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CONTACT POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

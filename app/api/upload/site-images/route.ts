import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET_NAME = "site-images";
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: "File too large",
          details: `Max 10MB, got ${(file.size / 1024 / 1024).toFixed(1)}MB`,
        },
        { status: 413 }
      );
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const ext = file.name.split(".").pop() || "jpg";
    const cleanName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);
    const filePath = `${folder}/${timestamp}-${randomId}-${cleanName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("[upload/site-images] Storage error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: filePath,
        name: file.name,
        size: file.size,
        type: file.type,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/upload/site-images] Error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

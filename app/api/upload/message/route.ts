import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET_NAME = "message-attachments";

// Size limits in bytes
const SIZE_LIMITS: Record<string, number> = {
  image: 5 * 1024 * 1024,      // 5 MB
  video: 25 * 1024 * 1024,     // 25 MB
  document: 10 * 1024 * 1024,  // 10 MB
};

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  document: [
    "application/pdf",
    "application/zip",
    "application/postscript",
    "image/vnd.adobe.photoshop",
  ],
};

function getFileCategory(mimeType: string): string | null {
  for (const [category, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(mimeType)) return category;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const orderId = formData.get("orderId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const category = getFileCategory(file.type);
    if (!category) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      );
    }

    const limit = SIZE_LIMITS[category];
    if (file.size > limit) {
      return NextResponse.json(
        {
          error: `${category} too large`,
          details: `Max ${(limit / 1024 / 1024).toFixed(0)}MB, got ${(file.size / 1024 / 1024).toFixed(1)}MB`,
        },
        { status: 413 }
      );
    }

    // Create unique path: orderId/timestamp-filename
    const timestamp = Date.now();
    const sanitizedOrderId = (orderId || "general").replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanFileName = file.name
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[:|()\\/ ]/g, "_");
    const filePath = `${sanitizedOrderId}/${timestamp}-${cleanFileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("[upload/message] Storage error:", uploadError);
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
        attachment: {
          url: publicUrl,
          name: file.name,
          type: file.type,
          size: file.size,
          category,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/upload/message] Error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

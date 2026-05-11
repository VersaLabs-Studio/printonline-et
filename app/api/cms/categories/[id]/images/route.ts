import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: images, error } = await supabaseAdmin
      .from("category_images")
      .select("*")
      .eq("category_id", id)
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch images", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("[CMS CATEGORY IMAGES GET] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { images } = body as {
      images: {
        url: string;
        alt_text?: string;
        display_order?: number;
        is_primary?: boolean;
      }[];
    };

    if (!images?.length) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    await supabaseAdmin
      .from("category_images")
      .delete()
      .eq("category_id", id);

    const rows = images.map((img, idx) => ({
      category_id: id,
      image_url: img.url,
      alt_text: img.alt_text || null,
      display_order: img.display_order ?? idx,
      is_primary: img.is_primary ?? idx === 0,
    }));

    const { data: inserted, error } = await supabaseAdmin
      .from("category_images")
      .insert(rows)
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save images", details: error.message },
        { status: 500 }
      );
    }

    const primaryImage = images.find((img) => img.is_primary) || images[0];
    if (primaryImage) {
      await supabaseAdmin
        .from("categories")
        .update({ image_url: primaryImage.url })
        .eq("id", id);
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("[CMS CATEGORY IMAGES POST] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

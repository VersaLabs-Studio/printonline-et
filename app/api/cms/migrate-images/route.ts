import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/permissions";

const TARGET_BUCKET = "site-images";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: images, error: fetchError } = await supabaseAdmin
      .from("product_images")
      .select("id, product_id, image_url, alt_text, display_order, is_primary");

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch images", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!images?.length) {
      return NextResponse.json({ success: true, message: "No images to migrate", migrated: 0 });
    }

    const results = { migrated: 0, skipped: 0, failed: 0, errors: [] as string[] };

    for (const img of images) {
      try {
        if (img.image_url.includes(TARGET_BUCKET)) {
          results.skipped++;
          continue;
        }

        const response = await fetch(img.image_url);
        if (!response.ok) {
          results.errors.push(`${img.id}: fetch failed (${response.status})`);
          results.failed++;
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const ext = (img.image_url.split(".").pop() || "jpg").split("?")[0];
        const filePath = `products/${img.product_id}/${img.id}.${ext}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from(TARGET_BUCKET)
          .upload(filePath, buffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          });

        if (uploadError) {
          results.errors.push(`${img.id}: upload failed (${uploadError.message})`);
          results.failed++;
          continue;
        }

        const {
          data: { publicUrl },
        } = supabaseAdmin.storage.from(TARGET_BUCKET).getPublicUrl(filePath);

        await supabaseAdmin
          .from("product_images")
          .update({ image_url: publicUrl })
          .eq("id", img.id);

        results.migrated++;
      } catch (err) {
        results.errors.push(`${img.id}: ${err instanceof Error ? err.message : "unknown"}`);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. ${results.migrated} migrated, ${results.skipped} skipped, ${results.failed} failed.`,
      ...results,
    });
  } catch (error) {
    console.error("[MIGRATE-IMAGES] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

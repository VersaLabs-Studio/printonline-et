import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TARGET_BUCKET = "site-images";
const PUBLIC_DIR = resolve(__dirname, "../public");

const supabase = createClient(supabaseUrl, supabaseKey);

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
};

async function migrate() {
  console.log("=== Product Image Migration to site-images ===\n");

  const { data: images, error: fetchError } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, alt_text, display_order, is_primary");

  if (fetchError) {
    console.error("Failed to fetch images:", fetchError.message);
    process.exit(1);
  }

  if (!images?.length) {
    console.log("No product images found in database.");
    process.exit(0);
  }

  console.log(`Found ${images.length} product images to process.\n`);

  const results = { migrated: 0, skipped: 0, failed: 0, errors: [] as string[] };

  for (const img of images) {
    const label = `${img.alt_text || img.id} (product: ${img.product_id})`;

    if (img.image_url.includes(TARGET_BUCKET)) {
      console.log(`  SKIP  ${label} — already in ${TARGET_BUCKET}`);
      results.skipped++;
      continue;
    }

    try {
      const isLocal = img.image_url.startsWith("/");
      let buffer: Buffer;

      if (isLocal) {
        const localPath = resolve(PUBLIC_DIR, img.image_url.replace(/^\//, ""));
        if (!existsSync(localPath)) {
          console.log(`  FAIL  ${label} — local file not found: ${localPath}`);
          results.errors.push(`${img.id}: local file not found (${localPath})`);
          results.failed++;
          continue;
        }
        buffer = readFileSync(localPath);
      } else {
        console.log(`  FETCH ${label}`);
        const response = await fetch(img.image_url);
        if (!response.ok) {
          console.log(`  FAIL  ${label} — fetch failed (${response.status})`);
          results.errors.push(`${img.id}: fetch failed (${response.status})`);
          results.failed++;
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }

      const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);

      const sourcePath = isLocal ? img.image_url : new URL(img.image_url).pathname;
      const cleanPath = sourcePath.split("?")[0];
      const ext = cleanPath.split(".").pop() || "jpg";
      const contentType = MIME_MAP[ext.toLowerCase()] || "image/jpeg";
      const filePath = `products/${img.product_id}/${img.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(TARGET_BUCKET)
        .upload(filePath, buffer, {
          cacheControl: "3600",
          upsert: true,
          contentType,
        });

      if (uploadError) {
        console.log(`  FAIL  ${label} — upload failed: ${uploadError.message}`);
        results.errors.push(`${img.id}: upload failed (${uploadError.message})`);
        results.failed++;
        continue;
      }

      const { data: urlData } = supabase.storage
        .from(TARGET_BUCKET)
        .getPublicUrl(filePath);

      await supabase
        .from("product_images")
        .update({ image_url: urlData.publicUrl })
        .eq("id", img.id);

      console.log(`  OK    ${label} — ${sizeMB}MB → ${filePath}`);
      results.migrated++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      console.log(`  FAIL  ${label} — ${msg}`);
      results.errors.push(`${img.id}: ${msg}`);
      results.failed++;
    }
  }

  console.log("\n=== Migration Complete ===");
  console.log(`  Migrated: ${results.migrated}`);
  console.log(`  Skipped:  ${results.skipped}`);
  console.log(`  Failed:   ${results.failed}`);

  if (results.errors.length > 0) {
    console.log("\n  Errors:");
    results.errors.forEach((e) => console.log(`    - ${e}`));
  }
}

migrate();

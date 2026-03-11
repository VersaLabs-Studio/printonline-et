// lib/queries/products.ts
// Server-side data fetching for products (React Server Components)
// These run on the server — no hooks, no "use client"

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductWithCategory, ProductWithDetails } from "@/types/database";

/**
 * Fetch all active products with category info (server component).
 * Used in: /all-products page, sitemap generation
 */
export async function getProducts(options?: {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}): Promise<ProductWithCategory[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (options?.categorySlug) {
    query = query.eq("category.slug", options.categorySlug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 50) - 1,
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as unknown as ProductWithCategory[]) ?? [];
}

/**
 * Fetch a single product by slug with full details (server component).
 * Used in: /products/[slug] page, metadata generation
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductWithDetails | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name, slug),
      product_images(
        id, image_url, alt_text, display_order, is_primary
      ),
      product_options(
        id, option_key, option_label, field_type, is_required,
        display_order, description, group_label,
        depends_on_option, depends_on_value,
        product_option_values(
          id, value, label, price_amount, price_type,
          group_name, description, display_order,
          is_default, is_active, metadata
        )
      ),
      pricing_matrix:product_pricing_matrix(
        id, product_id, matrix_key, matrix_label, price, is_active
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  const product = data as unknown as ProductWithDetails;

  // Sort images and options
  product.product_images.sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
  product.product_options.sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
  product.product_options.forEach((opt) => {
    opt.product_option_values = opt.product_option_values
      .filter((v) => v.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  });

  return product;
}

import { createStaticSupabaseClient } from "@/lib/supabase/static";

/**
 * Fetch all product slugs (for generateStaticParams).
 * Uses the static client because this runs at BUILD TIME — no cookies available.
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createStaticSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  if (error) throw error;
  return (data ?? []).map((p) => p.slug);
}

// lib/queries/categories.ts
// Server-side data fetching for categories (React Server Components)

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";

/**
 * Fetch all active categories (server component).
 * Used in: navigation, home page, category listing
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as Category[]) ?? [];
}

/**
 * Fetch a single category by slug (server component).
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data as Category;
}

/**
 * Fetch categories with product counts (server component).
 * Used in: home page category grid
 */
export async function getCategoriesWithCounts(): Promise<
  (Category & { productCount: number })[]
> {
  const supabase = await createServerSupabaseClient();

  const [
    { data: categories, error: catErr },
    { data: products, error: prodErr },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase.from("products").select("category_id").eq("is_active", true),
  ]);

  if (catErr) throw catErr;
  if (prodErr) throw prodErr;

  const countMap = (products ?? []).reduce<Record<string, number>>((acc, p) => {
    if (p.category_id) {
      acc[p.category_id] = (acc[p.category_id] || 0) + 1;
    }
    return acc;
  }, {});

  return (categories ?? []).map((cat) => ({
    ...(cat as Category),
    productCount: countMap[cat.id] || 0,
  }));
}

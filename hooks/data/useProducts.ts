"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ProductWithCategory } from "@/types";

export interface UseProductsOptions {
  categorySlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "name" | "base_price" | "created_at" | "display_order";
  sortOrder?: "asc" | "desc";
  inStock?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["products", options],
    queryFn: async (): Promise<ProductWithCategory[]> => {
      let query = supabase
        .from("products")
        .select(
          "*, category:categories(name, slug), product_images(image_url, alt_text, is_primary, display_order)",
        );

      // For CMS we might want all products, for storefront only active ones
      // In a real app we'd probably have an 'includeInactive' flag
      // query = query.eq("is_active", true);

      // Filter by category slug (via join)
      if (options.categorySlug) {
        query = query.eq("category.slug", options.categorySlug);
      }

      // Full-text search
      if (options.search) {
        query = query.or(
          `name.ilike.%${options.search}%,description.ilike.%${options.search}%`,
        );
      }

      // Stock filter
      if (options.inStock) {
        query = query.eq("in_stock", true);
      }

      // Sorting
      const sortBy = options.sortBy || "display_order";
      const sortOrder = options.sortOrder || "asc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 50) - 1,
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as unknown as ProductWithCategory[]) ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductsByCategory(categorySlug: string) {
  return useProducts({ categorySlug });
}

export function useFeaturedProducts(limit: number = 8) {
  return useProducts({
    limit,
    sortBy: "display_order",
    sortOrder: "asc",
  });
}

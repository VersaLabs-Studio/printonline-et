// hooks/data/useSearch.ts
// TanStack Query hook for global product search
// Uses PostgreSQL full-text search via the GIN index

"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ProductWithCategory } from "@/types/database";

/**
 * Search products by name/description.
 * Debounce the query input in the component before passing here.
 *
 * @example
 * const debouncedQuery = useDebounce(searchInput, 300);
 * const { data } = useSearch(debouncedQuery);
 */
export function useSearch(query: string, limit: number = 20) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["search", query, limit],
    queryFn: async (): Promise<ProductWithCategory[]> => {
      if (!query || query.trim().length < 2) return [];

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(name, slug),
          product_images(image_url, is_primary)
        `)
        .eq("is_active", true)
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`,
        )
        .order("display_order", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data as unknown as ProductWithCategory[]) ?? [];
    },
    enabled: !!query && query.trim().length >= 2,
    staleTime: 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData, // Keep old results while fetching new
  });
}

/**
 * Search suggestions for the header search bar dropdown.
 * Returns fewer results for quick display.
 */
export function useSearchSuggestions(query: string) {
  return useSearch(query, 5);
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/database";
import { toast } from "sonner";

export interface HomepageCategory extends Category {
  productCount: number;
}

/**
 * Fetch all categories with homepage visibility fields for CMS management.
 * Returns all categories (active + inactive) so admins can toggle visibility.
 */
export function useHomepageCategories() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["homepage-categories"],
    queryFn: async (): Promise<HomepageCategory[]> => {
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("homepage_display_order", { ascending: true });

      if (catError) throw catError;

      // Fetch product counts per category
      const { data: products, error: prodError } = await supabase
        .from("products")
        .select("category_id")
        .eq("is_active", true);

      if (prodError) throw prodError;

      const countMap = (products ?? []).reduce<Record<string, number>>(
        (acc, p) => {
          if (p.category_id) {
            acc[p.category_id] = (acc[p.category_id] || 0) + 1;
          }
          return acc;
        },
        {},
      );

      return (categories ?? []).map((cat) => ({
        ...cat,
        productCount: countMap[cat.id] || 0,
      }));
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Update a category's homepage visibility settings.
 * Uses the existing CMS categories PUT endpoint.
 */
export function useUpdateHomepageCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      show_on_homepage,
      homepage_display_order,
    }: {
      id: string;
      show_on_homepage?: boolean;
      homepage_display_order?: number;
    }) => {
      // Fetch current category data first to preserve required fields
      const supabase = createClient();
      const { data: current, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const res = await fetch(`/api/cms/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: current.name,
          slug: current.slug,
          description: current.description || "",
          imageUrl: current.image_url || "",
          displayOrder: current.display_order ?? 0,
          isActive: current.is_active ?? true,
          showOnHomepage: show_on_homepage ?? current.show_on_homepage ?? true,
          homepageDisplayOrder: homepage_display_order ?? current.homepage_display_order ?? 0,
          metaTitle: current.meta_title || "",
          metaDescription: current.meta_description || "",
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "with-counts"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

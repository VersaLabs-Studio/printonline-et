// hooks/data/useCategories.ts
// TanStack Query hook for fetching categories
// Categories are relatively static — cached for 10 minutes

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/database";
import { toast } from "sonner";

/**
 * Fetch all active categories, ordered by display_order.
 * Used in: navigation, mega-menu, category pages, CMS.
 */
export function useCategories() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data as Category[]) ?? [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes — categories rarely change
  });
}

/**
 * Fetch all categories including inactive (for CMS).
 */
export function useAllCategories() {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: async (): Promise<Category[]> => {
      const res = await fetch("/api/cms/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      return json.categories ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch a single category by slug.
 * Used on category detail pages.
 */
export function useCategory(slug: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["categories", slug],
    queryFn: async (): Promise<Category> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Category not found");

      return data as Category;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch categories with their product counts.
 * Used in: home page, category navigation.
 */
export function useCategoriesWithCounts() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["categories", "with-counts"],
    queryFn: async () => {
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

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
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cms/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/cms/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

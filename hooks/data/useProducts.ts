"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ProductWithCategory } from "@/types";
import { toast } from "sonner";

export interface UseProductsOptions {
  categorySlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "name" | "base_price" | "created_at" | "display_order";
  sortOrder?: "asc" | "desc";
  inStock?: boolean;
  includeInactive?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["products", options],
    queryFn: async (): Promise<ProductWithCategory[]> => {
      const selectStr = options.categorySlug
        ? "*, categories!inner(name, slug), product_images(image_url, alt_text, is_primary, display_order)"
        : "*, categories(name, slug), product_images(image_url, alt_text, is_primary, display_order)";

      let query = supabase.from("products").select(selectStr);

      // Storefront only shows active products; CMS shows all
      if (!options.includeInactive) {
        query = query.eq("is_active", true);
      }

      // Filter by category slug (via inner join)
      if (options.categorySlug) {
        query = query.eq("categories.slug", options.categorySlug);
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

      // Map 'categories' to 'category' for compatibility with types and components
      return (
        (data as any[])?.map((p) => ({
          ...p,
          category: p.categories,
        })) ?? []
      );
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

export function useAllProducts() {
  return useProducts({ sortBy: "name", sortOrder: "asc", includeInactive: true });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cms/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cms/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to deactivate product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deactivated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate product");
    },
  });
}

export function useToggleProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/cms/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update product status");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(variables.isActive ? "Product activated" : "Product deactivated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product status");
    },
  });
}

export function useHardDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/products/${id}?permanent=true`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product permanently deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
}

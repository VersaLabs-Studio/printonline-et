"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ProductWithDetails } from "@/types";

export function useProduct(slug: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["products", slug],
    queryFn: async (): Promise<ProductWithDetails> => {
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
          )
        `,
        )
        .eq("slug", slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Product not found");

      const product = data as unknown as ProductWithDetails;

      if (product.product_images) {
        product.product_images.sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        );
      }

      if (product.product_options) {
        product.product_options.sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        );
        product.product_options.forEach((option) => {
          if (option.product_option_values) {
            option.product_option_values.sort(
              (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
            );
          }
        });
      }

      return product;
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductById(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["products", "id", id],
    queryFn: async (): Promise<ProductWithDetails> => {
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
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Product not found");

      const product = data as unknown as ProductWithDetails;

      if (product.product_images) {
        product.product_images.sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        );
      }

      if (product.product_options) {
        product.product_options.sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        );
        product.product_options.forEach((option) => {
          if (option.product_option_values) {
            option.product_option_values.sort(
              (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
            );
          }
        });
      }

      return product;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProductOption, ProductOptionValue } from "@/types/database";

export type ProductOptionWithValues = ProductOption & {
  product_option_values: ProductOptionValue[];
};

export function useProductOptions(productId: string) {
  return useQuery({
    queryKey: ["product-options", productId],
    queryFn: async (): Promise<ProductOptionWithValues[]> => {
      const res = await fetch(`/api/cms/products/${productId}/options`);
      if (!res.ok) throw new Error("Failed to fetch options");
      const json = await res.json();
      return json.data ?? [];
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      ...data
    }: { productId: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/cms/products/${productId}/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create option");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-options", variables.productId],
      });
      toast.success("Option created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create option");
    },
  });
}

export function useUpdateOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      optionId,
      ...data
    }: {
      productId: string;
      optionId: string;
    } & Record<string, unknown>) => {
      const res = await fetch(
        `/api/cms/products/${productId}/options/${optionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update option");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-options", variables.productId],
      });
      toast.success("Option updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update option");
    },
  });
}

export function useDeleteOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      optionId,
    }: {
      productId: string;
      optionId: string;
    }) => {
      const res = await fetch(
        `/api/cms/products/${productId}/options/${optionId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete option");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-options", variables.productId],
      });
      toast.success("Option deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete option");
    },
  });
}

export function useCreateOptionValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      optionId,
      ...data
    }: {
      productId: string;
      optionId: string;
    } & Record<string, unknown>) => {
      const res = await fetch(
        `/api/cms/products/${productId}/options/${optionId}/values`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create value");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-options", variables.productId],
      });
      toast.success("Option value created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create value");
    },
  });
}

export function useUpdateOptionValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      optionId,
      valueId,
      ...data
    }: {
      productId: string;
      optionId: string;
      valueId: string;
    } & Record<string, unknown>) => {
      const res = await fetch(
        `/api/cms/products/${productId}/options/${optionId}/values/${valueId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update value");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-options", variables.productId],
      });
      toast.success("Option value updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update value");
    },
  });
}

export function useDeleteOptionValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      optionId,
      valueId,
    }: {
      productId: string;
      optionId: string;
      valueId: string;
    }) => {
      const res = await fetch(
        `/api/cms/products/${productId}/options/${optionId}/values/${valueId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete value");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-options", variables.productId],
      });
      toast.success("Option value deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete value");
    },
  });
}

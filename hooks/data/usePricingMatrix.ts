"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PricingMatrixEntry } from "@/types/database";

export function usePricingMatrix(productId: string) {
  return useQuery({
    queryKey: ["pricing-matrix", productId],
    queryFn: async (): Promise<PricingMatrixEntry[]> => {
      const res = await fetch(
        `/api/cms/products/${productId}/pricing-matrix`
      );
      if (!res.ok) throw new Error("Failed to fetch pricing matrix");
      const json = await res.json();
      return json.data ?? [];
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreatePricingEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      ...data
    }: { productId: string } & Record<string, unknown>) => {
      const res = await fetch(
        `/api/cms/products/${productId}/pricing-matrix`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create entry");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pricing-matrix", variables.productId],
      });
      toast.success("Pricing entry created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create entry");
    },
  });
}

export function useUpdatePricingEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      entryId,
      ...data
    }: {
      productId: string;
      entryId: string;
    } & Record<string, unknown>) => {
      const res = await fetch(
        `/api/cms/products/${productId}/pricing-matrix`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: entryId }),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update entry");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pricing-matrix", variables.productId],
      });
      toast.success("Pricing entry updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update entry");
    },
  });
}

export function useDeletePricingEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
    }: {
      productId: string;
    }) => {
      const res = await fetch(
        `/api/cms/products/${productId}/pricing-matrix`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete entries");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pricing-matrix", variables.productId],
      });
      toast.success("Pricing entries deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete entries");
    },
  });
}

export function useBulkImportPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      entries,
    }: {
      productId: string;
      entries: Record<string, unknown>[];
    }) => {
      const res = await fetch(
        `/api/cms/products/${productId}/pricing-matrix/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries }),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to import pricing data");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pricing-matrix", variables.productId],
      });
      toast.success("Pricing data imported successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to import pricing data");
    },
  });
}

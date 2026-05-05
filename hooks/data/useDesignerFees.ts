"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DesignerFeeTier } from "@/types/database";

export function useDesignerFeeTiers(productId: string) {
  return useQuery({
    queryKey: ["designer-fee-tiers", productId],
    queryFn: async (): Promise<DesignerFeeTier[]> => {
      const res = await fetch(`/api/cms/products/${productId}/designer-fees`);
      if (!res.ok) throw new Error("Failed to fetch designer fee tiers");
      const json = await res.json();
      return json.tiers ?? [];
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateDesignerFeeTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      ...data
    }: { productId: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/cms/products/${productId}/designer-fees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create tier");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["designer-fee-tiers", variables.productId],
      });
      toast.success("Designer fee tier created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create tier");
    },
  });
}

export function useUpdateDesignerFeeTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      tierId,
      ...data
    }: {
      productId: string;
      tierId: string;
    } & Record<string, unknown>) => {
      const res = await fetch(
        `/api/cms/products/${productId}/designer-fees/${tierId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update tier");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["designer-fee-tiers", variables.productId],
      });
      toast.success("Designer fee tier updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update tier");
    },
  });
}

export function useDeleteDesignerFeeTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      tierId,
    }: {
      productId: string;
      tierId: string;
    }) => {
      const res = await fetch(
        `/api/cms/products/${productId}/designer-fees/${tierId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete tier");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["designer-fee-tiers", variables.productId],
      });
      toast.success("Designer fee tier deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete tier");
    },
  });
}

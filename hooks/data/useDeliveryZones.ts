"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DeliveryZoneDB, DeliveryQuantityTier } from "@/types/database";

export type DeliveryZoneWithTiers = DeliveryZoneDB & {
  delivery_quantity_tiers: DeliveryQuantityTier[];
};

export function useDeliveryZones() {
  return useQuery({
    queryKey: ["delivery-zones"],
    queryFn: async (): Promise<DeliveryZoneWithTiers[]> => {
      const res = await fetch("/api/cms/delivery-zones");
      if (!res.ok) throw new Error("Failed to fetch delivery zones");
      const json = await res.json();
      return json.zones ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDeliveryZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cms/delivery-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create zone");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      toast.success("Delivery zone created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create zone");
    },
  });
}

export function useUpdateDeliveryZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/cms/delivery-zones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update zone");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      toast.success("Delivery zone updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update zone");
    },
  });
}

export function useDeleteDeliveryZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/delivery-zones/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete zone");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      toast.success("Delivery zone deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete zone");
    },
  });
}

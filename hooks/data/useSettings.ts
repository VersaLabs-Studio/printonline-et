"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  label: string;
  description: string | null;
  category: string;
  data_type: string;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSetting[]> => {
      const res = await fetch("/api/cms/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const json = await res.json();
      return json.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      setting_key,
      setting_value,
    }: {
      setting_key: string;
      setting_value: unknown;
    }) => {
      const res = await fetch("/api/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting_key, setting_value }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update setting");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Setting updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update setting");
    },
  });
}

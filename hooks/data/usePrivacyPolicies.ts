"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePrivacyPolicies() {
  return useQuery({
    queryKey: ["privacy-policies"],
    queryFn: async () => {
      const res = await fetch("/api/privacy-policies");
      if (!res.ok) throw new Error("Failed to fetch privacy policies");
      const json = await res.json();
      return json.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllPrivacyPolicies() {
  return useQuery({
    queryKey: ["privacy-policies", "all"],
    queryFn: async () => {
      const res = await fetch("/api/cms/privacy-policies");
      if (!res.ok) throw new Error("Failed to fetch privacy policies");
      const json = await res.json();
      return json.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePrivacyPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cms/privacy-policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create policy");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy-policies"] });
      toast.success("Policy created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create policy");
    },
  });
}

export function useUpdatePrivacyPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/cms/privacy-policies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update policy");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy-policies"] });
      toast.success("Policy updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update policy");
    },
  });
}

export function useDeletePrivacyPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/privacy-policies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete policy");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy-policies"] });
      toast.success("Policy deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete policy");
    },
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { CustomerProfile } from "@/types";

export function useCustomers() {
  const supabase = createClient();
  return useQuery<CustomerProfile[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCustomer(id: string) {
  const supabase = createClient();
  return useQuery<CustomerProfile | null>({
    queryKey: ["customers", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { CustomerProfile } from "@/types";

export type CustomerWithStats = CustomerProfile & {
  total_orders: number;
  last_order_date: string | null;
};

export function useCustomers() {
  const supabase = createClient();
  return useQuery<CustomerWithStats[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_profiles")
        .select(`
          *,
          orders (created_at)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((customer: any) => {
        const orders = customer.orders || [];
        return {
          ...customer,
          total_orders: orders.length,
          last_order_date: orders.length > 0
            ? orders.reduce((latest: string, current: any) =>
                new Date(current.created_at) > new Date(latest) ? current.created_at : latest,
                orders[0].created_at
              )
            : null
        };
      });
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

/**
 * Fetch a customer's order history.
 */
export function useCustomerOrders(customerId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["customers", customerId, "orders"],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!customerId,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCustomer() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomerProfile> & { id: string }) => {
      const { data, error } = await supabase
        .from("customer_profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", data.id] });
    },
  });
}

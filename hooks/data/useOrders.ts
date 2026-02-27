// hooks/data/useOrders.ts
// TanStack Query hooks for order operations
// Queries for customer-facing order history + CMS admin

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type {
  Order,
  OrderWithItems,
  OrderInsert,
  OrderItemInsert,
} from "@/types/database";

/**
 * Fetch orders for a specific customer.
 * Used on: /account/orders
 */
export function useOrders(customerId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["orders", customerId],
    queryFn: async (): Promise<Order[]> => {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (customerId) {
        query = query.eq("customer_id", customerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as Order[]) ?? [];
    },
    enabled: !!customerId,
    staleTime: 30 * 1000, // 30 seconds — orders update frequently
  });
}

/**
 * Fetch a single order with all its items.
 * Used on: /orders/[id], CMS order detail
 */
export function useOrder(orderId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async (): Promise<OrderWithItems> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Order not found");

      return data as unknown as OrderWithItems;
    },
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch an order by order number (e.g., POL-2026-00001).
 * Used on: order confirmation page
 */
export function useOrderByNumber(orderNumber: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["orders", "number", orderNumber],
    queryFn: async (): Promise<OrderWithItems> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("order_number", orderNumber)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Order not found");

      return data as unknown as OrderWithItems;
    },
    enabled: !!orderNumber,
    staleTime: 30 * 1000,
  });
}

/**
 * Create a new order with items.
 * Posts to the API route which uses the admin client.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      order: Omit<OrderInsert, "order_number">;
      items: Omit<OrderItemInsert, "order_id">[];
    }) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Order ${data.order_number} placed successfully!`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to place order: ${error.message}`);
    },
  });
}

/**
 * Update order status (CMS admin).
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      note,
    }: {
      orderId: string;
      status: string;
      note?: string;
    }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update order");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(`Order status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

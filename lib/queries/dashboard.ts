// lib/queries/dashboard.ts
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Order } from "@/types/database";

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  activeCustomers: number;
  totalCategories: number;
  pendingOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Use Promise.all for parallel fetching
  const [
    { count: totalOrders },
    { count: totalProducts },
    { data: revenueData },
    { data: customerData },
    { count: totalCategories },
    { count: pendingOrders }
  ] = await Promise.all([
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("total_amount"),
    supabaseAdmin.from("orders").select("customer_id"),
    supabaseAdmin.from("categories").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending")
  ]);

  const totalRevenue = (revenueData || []).reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
  const uniqueCustomers = new Set((customerData || []).map(c => c.customer_id)).size;

  return {
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalRevenue,
    activeCustomers: uniqueCustomers,
    totalCategories: totalCategories || 0,
    pendingOrders: pendingOrders || 0
  };
}

export async function getRecentOrdersSnippet(limit: number = 5): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as Order[]) ?? [];
}

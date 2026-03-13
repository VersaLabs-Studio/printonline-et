"use client";

import React from "react";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/database";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_number",
    header: "Order #",
    cell: ({ row }) => (
      <span className="font-semibold text-xs font-mono tracking-tighter bg-muted/40 px-1.5 py-0.5 rounded-md border border-border/10">
        {row.original.order_number}
      </span>
    ),
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-medium text-xs truncate max-w-[150px] block">
        {row.original.customer_name}
      </span>
    ),
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => (
      <PriceDisplay
        amount={row.original.total_amount}
        className="text-xs font-semibold"
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const config: Record<string, { label: string; className: string }> = {
        pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        delivered: { label: "Delivered", className: "bg-green-50 text-green-700 border-green-200" },
        cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
        processing: { label: "Processing", className: "bg-blue-50 text-blue-700 border-blue-200" },
        shipped: { label: "Shipped", className: "bg-purple-50 text-purple-700 border-purple-200" },
      };
      const { label, className } = config[status] || { label: status, className: "bg-muted text-muted-foreground" };
      return (
        <Badge variant="outline" className={cn("text-[8px] font-medium uppercase tracking-wider px-1.5 py-0 rounded-md", className)}>
          {label}
        </Badge>
      );
    },
  },
];

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full max-h-[500px]">
      <div className="p-4 border-b border-border/40 bg-muted/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ShoppingCart size={16} className="text-primary" /> Latest Orders
        </h3>
        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest h-7" asChild>
          <Link href="/cms/orders">View All</Link>
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20">
          <CMSDataTable 
            columns={columns} 
            data={orders} 
            searchPlaceholder="" 
            hidePagination 
            hideSearch
          />
        </div>
      </div>
      {orders.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-xs text-muted-foreground">No recent orders found.</p>
        </div>
      )}
    </div>
  );
}

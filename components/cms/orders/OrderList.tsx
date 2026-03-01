"use client";

import React from "react";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { Button } from "@/components/ui/button";
import {
  Eye,
  FileDown,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { OrderWithItems } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { icon: any; label: string; className: string }
> = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  processing: {
    icon: Clock,
    label: "Processing",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    icon: CheckCircle2,
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    icon: AlertCircle,
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export const columns: ColumnDef<OrderWithItems>[] = [
  {
    accessorKey: "order_number",
    header: "Order #",
    cell: ({ row }) => (
      <span className="font-bold text-sm font-mono tracking-tighter bg-muted/40 px-2 py-1 rounded-lg border border-border/20">
        {row.original.order_number}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.customer_name,
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-foreground">
          {row.original.customer_name}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          {row.original.customer_email}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.created_at,
    id: "date",
    header: "Order Date",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-bold text-foreground/80">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "hh:mm a")
            : ""}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.total_amount,
    id: "total_amount",
    header: "Total",
    cell: ({ row }) => (
      <PriceDisplay
        amount={row.original.total_amount}
        className="text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg"
      />
    ),
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const config = statusConfig[status] || {
        icon: Clock,
        label: status,
        className: "bg-muted text-muted-foreground border-transparent",
      };
      const Icon = config.icon;
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-bold uppercase tracking-widest gap-1.5 px-2.5 py-1 rounded-lg shadow-sm",
            config.className,
          )}
        >
          <Icon size={12} className="opacity-70" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted rounded-full active:scale-90 transition-all"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 rounded-xl shadow-xl border-border/40 p-1.5"
          >
            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-1.5">
              Order Management
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer font-bold text-xs gap-3 py-2"
            >
              <Link href={`/cms/orders/${order.id}`}>
                <Eye className="h-4 w-4 text-primary" /> View Full Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer font-bold text-xs gap-3 py-2">
              <FileDown className="h-4 w-4 text-primary" /> Generate Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem className="rounded-lg text-destructive focus:text-destructive cursor-pointer font-bold text-xs gap-3 py-2">
              <AlertCircle className="h-4 w-4" /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface OrderListProps {
  orders: OrderWithItems[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <CMSDataTable
      columns={columns as any}
      data={orders}
      searchPlaceholder="Search by number, customer or status..."
    />
  );
}

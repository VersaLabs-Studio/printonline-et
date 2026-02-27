"use client";

import React from "react";
import { useOrders } from "@/hooks/data/useOrders";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
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
import { Order } from "@/types";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function CMSOrdersPage() {
  const { data: orders, isLoading, error } = useOrders();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        };
      case "processing":
        return {
          icon: Clock,
          label: "Processing",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "shipped":
        return {
          icon: Truck,
          label: "Shipped",
          className: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "delivered":
        return {
          icon: CheckCircle2,
          label: "Delivered",
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          label: "Cancelled",
          className: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          icon: Clock,
          label: status,
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-bold text-sm font-mono">
          {row.original.order_number}
        </span>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm">
            {row.original.customer_name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {row.original.customer_email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => (
        <PriceDisplay
          amount={row.original.total_amount}
          className="text-sm font-bold text-primary"
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = getStatusConfig(row.original.status);
        const Icon = config.icon;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold uppercase tracking-tighter gap-1",
              config.className,
            )}
          >
            <Icon size={10} />
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
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/cms/orders/${order.id}`}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Orders"
        subtitle="Track and manage customer print orders."
        breadcrumbs={[{ label: "Orders" }]}
        actions={
          <Button variant="outline" className="rounded-xl gap-2">
            <FileDown size={18} />
            Export CSV
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
          <p className="text-destructive font-bold">Failed to load orders.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <CMSDataTable
          columns={columns}
          data={orders || []}
          searchPlaceholder="Search orders by number or customer..."
        />
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

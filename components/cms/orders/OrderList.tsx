"use client";

import React from "react";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  Printer,
  Package,
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
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusConfig: Record<
  string,
  { icon: React.ElementType; label: string; className: string }
> = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    icon: CheckCircle2,
    label: "Order Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  design_review: {
    icon: FileText,
    label: "Design Under Review",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  on_hold: {
    icon: AlertCircle,
    label: "On Hold",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved for Production",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  printing: {
    icon: Printer,
    label: "Printing in Progress",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  ready: {
    icon: Package,
    label: "Ready for Delivery",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  out_for_delivery: {
    icon: Truck,
    label: "Out for Delivery",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    icon: CheckCircle2,
    label: "Delivered",
    className: "bg-green-50 text-green-700 border-green-200",
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
      <span className="font-semibold text-sm font-mono tracking-tighter bg-muted/40 px-2 py-1 rounded-lg border border-border/20">
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
        <span className="font-semibold text-sm tracking-tight text-foreground">
          {row.original.customer_name}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
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
        <span className="text-xs font-medium text-foreground/80">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "hh:mm a")
            : ""}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.order_items?.length || 0,
    id: "items",
    header: "Items",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
        {row.original.order_items?.length || 0}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.total_amount,
    id: "total_amount",
    header: "Total",
    cell: ({ row }) => (
      <PriceDisplay
        amount={row.original.total_amount}
        className="text-sm font-semibold text-primary bg-primary/5 px-2 py-1 rounded-lg"
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
            "text-[9px] font-medium uppercase tracking-wider gap-1.5 px-2.5 py-1 rounded-lg shadow-sm",
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
    cell: function ActionCell({ row }) {
      const order = row.original;
      const [isCancelConfirmOpen, setIsCancelConfirmOpen] = React.useState(false);
      const [isProcessing, setIsProcessing] = React.useState(false);
      const router = useRouter();

      const handleCancel = async () => {
        try {
          setIsProcessing(true);
          const response = await fetch(`/api/orders/${order.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "cancelled",
              note: "Order cancelled by administrator from list view.",
            }),
          });

          if (!response.ok) throw new Error("Failed to cancel order");

          toast.success(`Order ${order.order_number} cancelled successfully`);
          setIsCancelConfirmOpen(false);
          router.refresh();
        } catch (error) {
          toast.error("Failed to cancel order. Please try again.");
          console.error(error);
        } finally {
          setIsProcessing(false);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-xl shadow-xl border-border/40 p-1.5"
            >
              <DropdownMenuLabel className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground px-2 py-1.5">
                Order Management
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-3 py-2"
              >
                <Link href={`/cms/orders/${order.id}`}>
                  <Eye className="h-4 w-4 text-primary" /> View Full Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem 
                className="rounded-lg text-destructive focus:text-destructive cursor-pointer font-semibold text-xs gap-3 py-2"
                onClick={() => setIsCancelConfirmOpen(true)}
              >
                <AlertCircle className="h-4 w-4" /> Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CMSConfirmDialog
            isOpen={isCancelConfirmOpen}
            onClose={() => !isProcessing && setIsCancelConfirmOpen(false)}
            onConfirm={handleCancel}
            title={`Cancel Order ${order.order_number}?`}
            description="This will mark the order as cancelled and notify the customer. This action is tracked in the status history."
            confirmLabel={isProcessing ? "Cancelling..." : "Confirm Cancellation"}
            variant="destructive"
          />
        </>
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
      columns={columns}
      data={orders}
      searchPlaceholder="Search by number, customer or status..."
    />
  );
}

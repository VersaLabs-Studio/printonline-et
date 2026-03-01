"use client";

import React from "react";
import { useOrder } from "@/hooks/data/useOrders";
import { useParams } from "next/navigation";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { OrderItemList } from "@/components/cms/orders/OrderItemList";
import { OrderCustomerInfo } from "@/components/cms/orders/OrderCustomerInfo";
import { OrderFulfillmentInfo } from "@/components/cms/orders/OrderFulfillmentInfo";
import { Card } from "@/components/ui/card";

const statusConfig: Record<
  string,
  { icon: any; label: string; className: string }
> = {
  pending: {
    icon: Clock,
    label: "Pending Receipt",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  processing: {
    icon: Clock,
    label: "In Production",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shipped: {
    icon: Truck,
    label: "Out for Delivery",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    icon: CheckCircle2,
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    icon: AlertCircle,
    label: "Voided",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function CMSOrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order)
    return (
      <div className="p-20 text-center font-bold uppercase text-muted-foreground">
        Master record not found.
      </div>
    );

  const currentStatus =
    statusConfig[order.status.toLowerCase()] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title={order.order_number}
        subtitle={`Transaction initialized on ${format(new Date(order.created_at!), "MMM d, yyyy 'at' hh:mm a")}`}
        backHref="/cms/orders"
        breadcrumbs={[
          { label: "Orders", href: "/cms/orders" },
          { label: order.order_number },
        ]}
        actions={
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest gap-2 px-5 py-2.5 rounded-xl shadow-lg border-2",
              currentStatus.className,
            )}
          >
            <StatusIcon size={16} />
            {currentStatus.label}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-8">
          <OrderItemList order={order} />

          {order.special_instructions && (
            <Card className="border-border/40 shadow-sm rounded-2xl bg-muted/10 p-6 border-l-4 border-l-primary/40">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <FileText size={14} className="text-primary" /> Customer
                Instructions
              </h5>
              <p className="text-sm font-bold leading-relaxed italic text-foreground/80">
                "{order.special_instructions}"
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <OrderCustomerInfo order={order} />
          <OrderFulfillmentInfo order={order} />

          <div className="space-y-3 pt-2">
            <Button className="w-full h-12 rounded-xl shadow-xl shadow-primary/20 font-bold uppercase tracking-widest text-[11px] gap-2 active:scale-95 transition-all">
              <CheckCircle2 size={18} /> Update Fulfillment Status
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-border/50 font-bold uppercase tracking-widest text-[11px] gap-2 hover:bg-muted/50 transition-all"
            >
              <Calendar size={18} className="text-primary" /> Logistics
              Scheduler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

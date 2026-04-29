"use client";

import React, { useState } from "react";
import { useOrder, useUpdateOrderStatus } from "@/hooks/data/useOrders";
import { useParams } from "next/navigation";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  FileText,
  Printer,
  Package,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { OrderItemList } from "@/components/cms/orders/OrderItemList";
import { OrderCustomerInfo } from "@/components/cms/orders/OrderCustomerInfo";
import { OrderFulfillmentInfo } from "@/components/cms/orders/OrderFulfillmentInfo";
import { Card } from "@/components/ui/card";
import { ORDER_STATUS_TRANSITIONS } from "@/lib/validations/cms";
import { normalizeOrderStatus, isAwaitingPayment } from "@/lib/order/status";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { toast } from "sonner";
import { MessagePortal } from "@/components/chat/MessagePortal";
import { authClient } from "@/lib/auth-client";

const statusConfig: Record<
  string,
  { icon: React.ElementType; label: string; className: string; description: string }
> = {
  pending: {
    icon: Clock,
    label: "Pending Payment",
    description: "Awaiting customer payment via Chapa.",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  order_confirmed: {
    icon: CheckCircle2,
    label: "Order Confirmed",
    description: "Payment received. Ready for design review.",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  design_under_review: {
    icon: FileText,
    label: "Design Under Review",
    description: "Graphic design team is verifying assets.",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  on_hold: {
    icon: AlertCircle,
    label: "On Hold",
    description: "Waiting for customer clarification or assets.",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved_for_production: {
    icon: ShieldCheck,
    label: "Approved for Production",
    description: "Design verified and queued for printing.",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  printing_in_progress: {
    icon: Printer,
    label: "Printing in Progress",
    description: "Active production on the printing floor.",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  ready_for_delivery: {
    icon: Package,
    label: "Ready for Delivery",
    description: "Quality checked and packaged.",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  out_for_delivery: {
    icon: Truck,
    label: "Out for Delivery",
    description: "Dispatched with Pana Logistics fleet.",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    icon: CheckCircle2,
    label: "Delivered",
    description: "Order successfully handed to customer.",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    icon: AlertCircle,
    label: "Cancelled",
    description: "Transaction terminated.",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  payment_failed: {
    icon: AlertCircle,
    label: "Payment Failed",
    description: "Customer payment failed. Awaiting retry.",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function CMSOrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id as string);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const updateStatus = useUpdateOrderStatus();
  const { data: session } = authClient.useSession();

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
        Order not found.
      </div>
    );

  const normalizedStatus = normalizeOrderStatus(order.status);
  const currentStatusKey = normalizedStatus;
  const currentStatus = statusConfig[currentStatusKey] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  const isPaymentBlocking = isAwaitingPayment(order.payment_status);

  // Get raw allowed transitions, then filter out order_confirmed if payment is still pending
  let allowedNextStatuses = ORDER_STATUS_TRANSITIONS[currentStatusKey] || [];
  if (isPaymentBlocking && currentStatusKey === "pending") {
    allowedNextStatuses = allowedNextStatuses.filter((s) => s !== "order_confirmed");
  }

  const handleStatusUpdate = (newStatus: string) => {
    if (currentStatusKey === "pending" && newStatus === "order_confirmed" && isPaymentBlocking) {
      toast.error("Cannot confirm an unpaid order manually. Customer must complete payment.");
      setPendingStatus(null);
      return;
    }

    updateStatus.mutate(
      {
        orderId: order.id,
        status: newStatus,
        note: `Status advanced from ${currentStatusKey} to ${newStatus} by admin.`,
      },
      {
        onSettled: () => setPendingStatus(null),
      }
    );
  };

  const adminUserId = session?.user?.id || "";
  const customerAuthId = (order as any).customer?.auth_user_id || "";

  return (
    <div className="space-y-8 pb-10">
      <CMSPageHeader
        title={order.order_number}
        subtitle={`Placed on ${format(new Date(order.created_at!), "MMM d, yyyy 'at' hh:mm a")}`}
        backHref="/cms/orders"
        breadcrumbs={[
          { label: "Orders", href: "/cms/orders" },
          { label: order.order_number },
        ]}
        actions={
          <div className="flex items-center gap-4">
             <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] gap-2 px-6 py-3 rounded-2xl shadow-sm border-2",
                currentStatus.className,
              )}
            >
              <StatusIcon size={16} />
              {currentStatus.label}
            </Badge>
          </div>
        }
      />

      {/* Payment Status Alert */}
      {isPaymentBlocking && (
        <Card className="border-amber-200 bg-amber-50/50 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle className="text-amber-500 shrink-0" size={24} />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              Payment {order.payment_status === "failed" ? "Failed" : "Pending"}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {order.payment_status === "failed"
                ? "Customer payment was unsuccessful. Order cannot proceed until payment is retried and confirmed."
                : "Awaiting customer to complete Chapa checkout. Order will auto-confirm upon successful payment."}
            </p>
          </div>
          {order.payment_status === "failed" && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 uppercase text-[9px] tracking-widest font-bold">
              Retry Required
            </Badge>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Controller */}
          <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border/20 bg-muted/5 flex items-center justify-between">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">Order Status</h5>
                <p className="text-xs font-medium text-muted-foreground">Update the order status to reflect current progress.</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-4">
                {allowedNextStatuses.length > 0 ? (
                  allowedNextStatuses.map((nextKey) => {
                    const cfg = statusConfig[nextKey];
                    if (!cfg) return null;
                    const NextIcon = cfg.icon;
                    return (
                      <Button
                        key={nextKey}
                        onClick={() => setPendingStatus(nextKey)}
                        disabled={updateStatus.isPending}
                        variant={nextKey === "cancelled" ? "ghost" : "outline"}
                        className={cn(
                          "h-auto py-4 px-5 rounded-xl border-2 flex-1 min-w-[180px] flex flex-col items-start gap-2 transition-all group",
                          nextKey === "cancelled"
                            ? "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            : "hover:border-primary/50 hover:bg-primary/5 shadow-sm"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={cn(
                            "p-2 rounded-lg group-hover:scale-110 transition-transform",
                            nextKey === "cancelled" ? "bg-red-100/50 text-red-600" : "bg-primary/10 text-primary"
                          )}>
                            <NextIcon size={18} />
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground/20 group-hover:text-primary/40 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Advance to</p>
                          <p className="text-sm font-bold tracking-tight">{cfg.label}</p>
                        </div>
                      </Button>
                    );
                  })
                ) : (
                  <div className="w-full p-8 rounded-xl border-2 border-dashed border-border/40 bg-muted/10 flex flex-col items-center text-center">
                    <CheckCircle2 size={32} className="text-emerald-500 mb-3 opacity-50" />
                    <p className="font-bold text-foreground">Order Complete</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">This order has reached its final status. No further updates are available.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <OrderItemList order={order} />

          {/* Admin-Customer Messaging */}
          {adminUserId && customerAuthId && (
            <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/20 bg-muted/5 flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1 flex items-center gap-2">
                    <MessageSquare size={14} /> Customer Messages
                  </h5>
                  <p className="text-xs font-medium text-muted-foreground">Communicate with the customer about this order.</p>
                </div>
              </div>
              <div className="p-6">
                <MessagePortal
                  orderId={order.id}
                  currentUserId={adminUserId}
                  recipientId={customerAuthId}
                  isAdmin={true}
                />
              </div>
            </Card>
          )}

          {order.internal_notes && (
            <Card className="border-border/40 shadow-sm rounded-2xl bg-muted/5 p-6 border-l-4 border-l-primary group">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-2">
                Internal Notes
              </h5>
              <p className="text-sm font-semibold leading-relaxed text-foreground/80 italic">
                &quot;{order.internal_notes}&quot;
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          <OrderCustomerInfo order={order} />
          <OrderFulfillmentInfo order={order} />

          <div className="p-6 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground relative overflow-hidden group">
            <div className="relative z-10">
              <h6 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 opacity-70">Need Help?</h6>
              <p className="text-xl font-bold tracking-tighter mb-1">+251 911 223344</p>
              <p className="text-xs font-medium opacity-60">Contact support for assistance.</p>
              <Button className="w-full mt-4 bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-widest text-[9px] h-10 shadow-md rounded-lg">
                 Contact Support
              </Button>
            </div>
            <Printer size={80} className="absolute -bottom-6 -right-6 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <CMSConfirmDialog
        isOpen={!!pendingStatus}
        onClose={() => setPendingStatus(null)}
        onConfirm={() => pendingStatus && handleStatusUpdate(pendingStatus)}
        title="Confirm Status Change"
        description={`You are about to change this order from "${currentStatus.label}" to "${statusConfig[pendingStatus!]?.label}". This will notify the customer. Proceed?`}
        confirmLabel="Confirm"
        variant={pendingStatus === "cancelled" ? "destructive" : "primary"}
      />
    </div>
  );
}

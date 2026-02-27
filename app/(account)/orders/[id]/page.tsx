"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrder } from "@/hooks/data/useOrders";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Loader2,
  Package,
  MapPin,
  CreditCard,
  Printer,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle size={24} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find the order you&apos;re looking for or you
          don&apos;t have permission to view it.
        </p>
        <Link href="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          iconColor: "text-yellow-500",
        };
      case "processing":
        return {
          icon: Loader2,
          label: "Processing",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          iconColor: "text-blue-500",
        };
      case "shipped":
        return {
          icon: Truck,
          label: "Shipped",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          iconColor: "text-indigo-500",
        };
      case "delivered":
        return {
          icon: CheckCircle2,
          label: "Delivered",
          color: "bg-green-50 text-green-700 border-green-200",
          iconColor: "text-green-500",
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          label: "Cancelled",
          color: "bg-red-50 text-red-700 border-red-200",
          iconColor: "text-red-500",
        };
      default:
        return {
          icon: Package,
          label: status,
          color: "bg-muted text-muted-foreground border-border",
          iconColor: "text-muted-foreground",
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-full"
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Order {order.order_number}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock size={14} />
              Placed on{" "}
              {order.created_at
                ? format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")
                : "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print Receipt</span>
          </Button>
          <Badge
            variant="outline"
            className={`h-9 px-4 text-sm font-medium ${statusConfig.color}`}
          >
            <StatusIcon
              size={14}
              className={`mr-2 ${order.status === "processing" ? "animate-spin" : ""}`}
            />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package size={18} />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.order_items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/50">
                      {item.product_image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Package
                          size={32}
                          className="text-muted-foreground/30"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-foreground truncate">
                          {item.product_name}
                        </h4>
                        <span className="font-bold text-foreground">
                          ETB {item.line_total.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground capitalize">
                          Category: {item.category || "General"}
                        </p>

                        {/* Selected Options */}
                        {item.selected_options &&
                          Object.keys(item.selected_options).length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                              {Object.entries(
                                item.selected_options as Record<string, string>,
                              ).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="text-[11px] flex items-center gap-1"
                                >
                                  <span className="text-muted-foreground uppercase tracking-wider font-semibold">
                                    {key.replace(/_/g, " ")}:
                                  </span>
                                  <span className="text-foreground">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Design File */}
                        {item.design_file_name && (
                          <div className="mt-3 inline-flex items-center gap-2 text-xs bg-primary/5 text-primary-700 px-3 py-1.5 rounded-full border border-primary/10">
                            <FileText size={12} />
                            <span className="font-medium">
                              Design: {item.design_file_name}
                            </span>
                          </div>
                        )}

                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Quantity:
                          </span>
                          <span className="ml-1 font-medium">
                            {item.quantity}
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="ml-1 font-medium">
                            ETB {item.unit_price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity/Status History */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock size={18} />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-border/60">
                <div className="relative flex items-center transition-all duration-500">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-sm z-10 ${order.status === "pending" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"}`}
                  >
                    <Clock size={16} />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-sm">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {order.created_at
                        ? format(
                            new Date(order.created_at),
                            "MMM d, yyyy 'at' h:mm a",
                          )
                        : ""}
                    </p>
                  </div>
                </div>

                {order.status !== "pending" && (
                  <div className="relative flex items-center transition-all duration-500">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-sm z-10 ${["processing", "shipped", "delivered"].includes(order.status) ? (order.status === "processing" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white") : "bg-muted text-muted-foreground"}`}
                    >
                      <Printer size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-sm">Processing & Printing</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status === "processing"
                          ? "Currently in production"
                          : ["shipped", "delivered"].includes(order.status)
                            ? "Completed"
                            : "Awaiting start"}
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "shipped" || order.status === "delivered" ? (
                  <div className="relative flex items-center transition-all duration-500">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-sm z-10 ${order.status === "shipped" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"}`}
                    >
                      <Truck size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-sm">
                        Shipped & Out for Delivery
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your package is on its way to you.
                      </p>
                    </div>
                  </div>
                ) : null}

                {order.status === "delivered" && (
                  <div className="relative flex items-center transition-all duration-500">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-sm z-10 bg-green-500 text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-sm">Delivered</p>
                      <p className="text-xs text-muted-foreground">
                        Successfully delivered to your address.
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "cancelled" && (
                  <div className="relative flex items-center transition-all duration-500">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-sm z-10 bg-red-500 text-white">
                      <AlertCircle size={16} />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-sm">Order Cancelled</p>
                      <p className="text-xs text-muted-foreground">
                        This order has been cancelled.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Totals, Address, Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>ETB {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (15% VAT)</span>
                <span>ETB {order.tax_amount?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>ETB {order.delivery_fee?.toLocaleString() || "0"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary font- Pana">
                  ETB {order.total_amount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin size={18} />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-1">
              <p className="font-bold text-foreground mb-2">
                {order.customer_name}
              </p>
              <p className="text-muted-foreground">
                {order.delivery_address || "No address provided"}
              </p>
              {(order.delivery_city || order.delivery_sub_city) && (
                <p className="text-muted-foreground">
                  {order.delivery_sub_city
                    ? `${order.delivery_sub_city}, `
                    : ""}
                  {order.delivery_city || ""}
                </p>
              )}
              <div className="pt-3 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Contact:</p>
                <p className="text-foreground font-medium">
                  {order.customer_phone}
                </p>
                <p className="text-foreground font-medium text-xs">
                  {order.customer_email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard size={18} />
                Payment & Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {order.payment_method || "Direct Bank Transfer / Telebirr"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <Badge
                  variant={
                    order.payment_status === "paid" ? "default" : "outline"
                  }
                  className={
                    order.payment_status === "paid" ? "bg-green-500" : ""
                  }
                >
                  {order.payment_status === "paid"
                    ? "Paid"
                    : "Pending / Verification"}
                </Badge>
              </div>
              {order.customer_tin && (
                <div className="space-y-1 pt-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-tighter">
                    Tax Identification Number (TIN)
                  </p>
                  <p className="text-sm font-mono font-bold tracking-widest">
                    {order.customer_tin}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help/Contact */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-3">
            <h4 className="text-sm font-bold">
              Have a question about this order?
            </h4>
            <p className="text-xs text-muted-foreground px-2">
              Our support team is available 24/7 to assist with your printing
              requirements.
            </p>
            <Button
              variant="link"
              className="text-primary font-bold h-auto p-0 text-xs"
            >
              Chat with Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

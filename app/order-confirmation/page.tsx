"use client";

import React from "react";
import { ConfirmationHeader } from "@/components/order/ConfirmationHeader";
import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { ConfirmationDetails } from "@/components/order/ConfirmationDetails";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { SafeMotionDiv } from "@/components/shared/SafeMotion";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useCart } from "@/context/CartContext";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const txRef = searchParams.get("tx_ref");

  const { clearCart } = useCart();
  
  // Query for order by order_number (when coming from account page or direct link)
  const { data: orderByNumber, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderNumber}`);
      if (!res.ok) throw new Error("Order not found");
      const json = await res.json();
      return json.order;
    },
    enabled: !!orderNumber,
  });

  const { data: verificationData, isLoading: isVerifying } = useQuery({
    queryKey: ["verify-payment", txRef],
    queryFn: async () => {
      const res = await fetch(`/api/payments/verify?tx_ref=${txRef}`);
      const data = await res.json();
      
      if (data.success) {
        // Clear cart only after successful payment verification
        clearCart();

        // Trigger email once verified successfully
        await fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "order_confirmation",
            order_id: data.order.id,
          }),
        });
      }
      
      return data;
    },
    enabled: !!txRef,
    retry: 1,
  });

  // Use order from verification response (when coming from Chapa) or from direct query
  const orderDetails = orderByNumber || (verificationData?.success ? verificationData.order : null);
  const isLoading = isOrderLoading || (isVerifying && !verificationData);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="space-y-2">
          <p className="text-xl font-semibold uppercase tracking-widest text-primary animate-pulse">
            {isVerifying ? "Verifying Payment..." : "Loading Order Details..."}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {isVerifying ? "Securing your transaction with Chapa..." : "Retrieving your order information..."}
          </p>
        </div>
      </div>
    );
  }

  if (txRef && verificationData && !verificationData.success) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="h-24 w-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight uppercase text-red-500">
            Payment Verification Failed
          </h1>
          <p className="max-w-md mx-auto text-muted-foreground font-medium text-sm leading-relaxed">
            We couldn&apos;t automatically verify your payment. This might be due to a network delay or a canceled transaction.
          </p>
          {verificationData.details && (
             <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 opacity-60">
               Reason: {verificationData.details}
             </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            asChild
            className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-primary/20"
          >
            <Link href="/order-summary?step=3">Return to Payment</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs border-border/40"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-32 w-32 bg-primary/5 rounded-[3rem] flex items-center justify-center text-primary/30 shadow-inner">
          <ShoppingBag size={64} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight uppercase">
            No Order Found
          </h1>
          <p className="text-muted-foreground font-bold">
            This order could not be found. Browse our products to place a new
            order.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs"
        >
          <Link href="/all-products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-emerald-500/2 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <main className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <SafeMotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ConfirmationHeader orderId={orderDetails.order_number} />
          </SafeMotionDiv>

          <SafeMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <OrderStatusTracker
              date={orderDetails.created_at ? new Date(orderDetails.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
              status={orderDetails.status}
            />
          </SafeMotionDiv>

          <SafeMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ConfirmationDetails orderDetails={orderDetails} />
          </SafeMotionDiv>

          <footer className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
            <Button
              asChild
              variant="outline"
              className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs border-border/40 hover:bg-muted group"
            >
              <Link href="/account" className="flex items-center gap-3">
                <User
                  size={18}
                  className="opacity-40 group-hover:scale-110 transition-transform"
                />
                My Account
              </Link>
            </Button>
            <Button
              asChild
              className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-sm hover:shadow-xl hover:shadow-primary/20 group"
            >
              <Link href="/all-products" className="flex items-center gap-3">
                Continue Shopping
                <ArrowRight
                  size={18}
                  className="opacity-40 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

"use client";

import React from "react";
import { ConfirmationHeader } from "@/components/order/ConfirmationHeader";
import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { ConfirmationDetails } from "@/components/order/ConfirmationDetails";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderNumber}`);
      if (!res.ok) throw new Error("Order not found");
      const json = await res.json();
      return json.order;
    },
    enabled: !!orderNumber,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-bold animate-pulse">
          Loading order details...
        </p>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ConfirmationHeader orderId={orderDetails.order_number} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <OrderStatusTracker
              date={new Date(orderDetails.created_at).toLocaleDateString()}
              status={orderDetails.status}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ConfirmationDetails orderDetails={orderDetails} />
          </motion.div>

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

"use client";

import React, { use } from "react";
import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { ConfirmationDetails } from "@/components/order/ConfirmationDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw, PackageOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const orderNumber = unwrappedParams.id;

  const {
    data: orderDetails,
    isLoading,
    refetch,
  } = useQuery({
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
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-bold animate-pulse text-xs uppercase tracking-widest">
          Inspecting Order Records...
        </p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-24 w-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary/40 shadow-inner">
          <PackageOpen size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight uppercase">
            Order Record Not Found
          </h1>
          <p className="text-muted-foreground font-bold">
            We couldn't locate this transaction id inside your account ledger.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs btn-pana"
        >
          <Link href="/orders">Return to History</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
            <div className="space-y-4">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Back to Dashboard
              </Link>
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground uppercase flex items-center gap-4">
                  Order #{orderDetails.order_number}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="font-bold uppercase tracking-widest text-[10px] shadow-sm bg-background border-border/40 px-3 py-1"
                  >
                    {orderDetails.status}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                    Created on{" "}
                    {new Date(orderDetails.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2 h-10 w-fit rounded-xl font-bold tracking-widest uppercase text-[10px] border-border/40 hover:bg-muted/50 transition-all"
            >
              <RefreshCcw size={14} className="opacity-40" /> Sync Status
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <OrderStatusTracker
              date={new Date(orderDetails.created_at).toLocaleDateString()}
            />
          </motion.div>

          {/* We reuse the newly refactored ConfirmationDetails block to visualize data beautifully */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ConfirmationDetails orderDetails={orderDetails} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

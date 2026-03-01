"use client";

import React from "react";
import { useOrders } from "@/hooks/data/useOrders";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { OrderList } from "@/components/cms/orders/OrderList";
import { Button } from "@/components/ui/button";
import { FileDown, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CMSOrdersPage() {
  const { data: orders, isLoading, error, refetch } = useOrders();

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Order Management"
        subtitle="Track, manage and fulfill customer print orders."
        breadcrumbs={[{ label: "Orders" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl gap-2 font-bold border-border/60 hover:bg-muted/50"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCcw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Sync
            </Button>
            <Button
              variant="outline"
              className="rounded-xl gap-2 font-bold border-border/60 hover:bg-muted/50"
            >
              <FileDown size={18} className="text-primary" />
              Export (CSV)
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-[500px] w-full rounded-2xl shadow-sm" />
        </div>
      ) : error ? (
        <div className="p-20 text-center bg-destructive/5 rounded-3xl border-2 border-dashed border-destructive/20 space-y-4">
          <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <RefreshCcw size={32} className="text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold uppercase tracking-tight text-destructive">
              Data Sync Failed
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto font-bold">
              We couldn't retrieve the latest orders from the server. Check your
              internet connection or Supabase status.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-destructive/30 hover:bg-destructive/10 font-bold uppercase tracking-widest text-[11px] px-6 h-10 transition-all"
            onClick={() => refetch()}
          >
            Retry Sync
          </Button>
        </div>
      ) : (
        <OrderList orders={orders || []} />
      )}
    </div>
  );
}

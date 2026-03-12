"use client";

import React from "react";
import { ProductWithDetails } from "@/types";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: ProductWithDetails;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const stockLabels: Record<
    string,
    { label: string; icon: React.ElementType; class: string }
  > = {
    in_stock: {
      label: "In Stock",
      icon: CheckCircle2,
      class: "text-emerald-500 bg-emerald-50 border-emerald-100",
    },
    low_stock: {
      label: "Low Stock",
      icon: AlertCircle,
      class: "text-amber-500 bg-amber-50 border-amber-100",
    },
    out_of_stock: {
      label: "Out of Stock",
      icon: AlertCircle,
      class: "text-rose-500 bg-rose-50 border-rose-100",
    },
    made_to_order: {
      label: "Made to Order",
      icon: Clock,
      class: "text-primary bg-primary/5 border-primary/10",
    },
  };

  const status = stockLabels[product.stock_status] || stockLabels.made_to_order;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      {product.stock_status === "out_of_stock" && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-destructive">
              Currently Unavailable
            </span>
            <span className="text-[10px] font-medium text-destructive/70">
              This item is out of stock. Please check back later or contact us for restock info.
            </span>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "h-6 rounded-lg text-xs font-semibold uppercase tracking-wider gap-1.5 px-3 border-2 shadow-sm",
              status.class,
            )}
          >
            <StatusIcon size={12} />
            {status.label}
          </Badge>
          {product.category && (
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-40">
              {product.category.name}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-tight">
          {product.name}
        </h1>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-xl md:text-2xl font-semibold text-primary tracking-tight">
          <PriceDisplay amount={product.base_price} />
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none opacity-60">
          Starting Unit Price
        </span>
      </div>

      {product.short_description && (
        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xl">
          {product.short_description}
        </p>
      )}
    </div>
  );
}

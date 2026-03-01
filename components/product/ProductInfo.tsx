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
    { label: string; icon: any; class: string }
  > = {
    in_stock: {
      label: "Fully Available",
      icon: CheckCircle2,
      class: "text-emerald-500 bg-emerald-50 border-emerald-100",
    },
    low_stock: {
      label: "Limited Reservation",
      icon: AlertCircle,
      class: "text-amber-500 bg-amber-50 border-amber-100",
    },
    out_of_stock: {
      label: "Archives Only",
      icon: AlertCircle,
      class: "text-rose-500 bg-rose-50 border-rose-100",
    },
    made_to_order: {
      label: "Precision Crafting",
      icon: Clock,
      class: "text-primary bg-primary/5 border-primary/10",
    },
  };

  const status = stockLabels[product.stock_status] || stockLabels.made_to_order;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "h-6 rounded-lg text-[9px] font-black uppercase tracking-widest gap-1.5 px-3 border-2 shadow-sm",
              status.class,
            )}
          >
            <StatusIcon size={12} />
            {status.label}
          </Badge>
          {product.category && (
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
              {product.category.name}
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground drop-shadow-sm leading-tight">
          {product.name}
        </h1>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-primary tracking-tighter">
          <PriceDisplay amount={product.base_price} />
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
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

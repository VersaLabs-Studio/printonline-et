"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ProductWithDetails } from "@/types";
import { cn } from "@/lib/utils";

interface ProductDetailInfoProps {
  product: ProductWithDetails;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const stockStatusConfig = {
    in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
    low_stock: "bg-yellow-50 text-yellow-700 border-yellow-200",
    out_of_stock: "bg-red-50 text-red-700 border-red-200",
    made_to_order: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Package size={16} className="text-primary" /> Core Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Base
              Price
            </label>
            <div className="text-2xl font-bold text-primary tracking-tight">
              <PriceDisplay amount={product.base_price} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> SKU /
              Identifier
            </label>
            <div className="text-sm font-mono font-bold tracking-widest bg-muted/60 w-fit px-4 py-1.5 rounded-xl border border-border/30 shadow-inner">
              {product.sku || product.id.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Product
            Description
          </label>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/20">
            <p className="text-sm text-foreground/80 leading-relaxed font-bold">
              {product.description ||
                "No full description provided for this product."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoStat label="Stock Status">
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                stockStatusConfig[
                  product.stock_status as keyof typeof stockStatusConfig
                ] || "bg-muted text-muted-foreground",
              )}
            >
              {product.stock_status.replace(/_/g, " ")}
            </Badge>
          </InfoStat>
          <InfoStat label="Badge">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              {product.badge || "NONE"}
            </div>
          </InfoStat>
          <InfoStat label="Form Type">
            <div className="text-xs font-bold capitalize tracking-tight">
              {product.form_type}
            </div>
          </InfoStat>
          <InfoStat label="Min Order">
            <div className="text-xs font-bold">
              {product.min_order_quantity} Pcs
            </div>
          </InfoStat>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoStat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border border-border/40 bg-card hover:border-primary/20 transition-colors shadow-sm text-center flex flex-col items-center justify-center gap-1.5">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      {children}
    </div>
  );
}

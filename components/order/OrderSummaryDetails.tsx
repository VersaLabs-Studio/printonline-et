"use client";

import React from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { FileText, Package } from "lucide-react";

interface OrderSummaryDetailsProps {
  cartItems?: Record<string, any>[];
  total?: number;
  orderItem?: Record<string, any>;
}

export function OrderSummaryDetails({
  cartItems,
  total,
  orderItem,
}: OrderSummaryDetailsProps) {
  const getDisplayOptions = (options: Record<string, unknown>) => {
    return Object.entries(options)
      .filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          _ !== "quantity",
      )
      .map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        value:
          typeof value === "boolean" ? (value ? "Yes" : "No") : String(value),
      }));
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl border border-border/40 p-8 shadow-sm sticky top-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8 flex items-center gap-2">
        <Package size={14} className="text-primary" /> Your Items
      </h2>

      {cartItems ? (
        <div className="space-y-6 mb-10">
          {cartItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold tracking-tight text-foreground uppercase truncate">
                  {item.name}{" "}
                  <span className="text-muted-foreground ml-2">
                    x{item.quantity}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground uppercase truncate mt-1">
                  {Object.entries(item.selectedOptions || {})
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </p>
                <PriceDisplay
                  amount={item.unitPrice * item.quantity}
                  size="sm"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        orderItem && (
          <div className="space-y-4 mb-10">
            <div className="flex gap-6 mb-8">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shrink-0 shadow-inner">
                <Image
                  src={orderItem.productImage}
                  alt={orderItem.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 py-1">
                <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">
                  {orderItem.productName}
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-wider opacity-60">
                  {orderItem.category}
                </p>
              </div>
            </div>
            {getDisplayOptions(orderItem.customOptions || {}).map(
              (option, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center group py-1 border-b border-border/10 last:border-0 pb-3"
                >
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                    {option.label}
                  </span>
                  <span className="text-xs font-bold text-foreground uppercase tracking-tight">
                    {option.value}
                  </span>
                </div>
              ),
            )}
          </div>
        )
      )}

      {orderItem?.designFile && (
        <div className="mb-10 p-4 rounded-2xl bg-muted/20 border border-border/20 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground uppercase truncate">
              {orderItem.designFile.name}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Attached File • {(orderItem.designFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-border/20">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Order Total
            </span>
            <p className="text-xs font-bold text-muted-foreground uppercase italic leading-none">
              VAT Inclusive (15%)
            </p>
          </div>
          <PriceDisplay
            amount={total !== undefined ? total : orderItem?.totalPrice || 0}
            className="text-4xl font-bold text-primary tracking-tight drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

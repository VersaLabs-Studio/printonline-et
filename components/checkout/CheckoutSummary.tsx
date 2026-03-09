"use client";

import React from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ShieldCheck, Package, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CheckoutSummaryProps {
  cart: any[];
  subtotal: number;
  delivery: number;
  total: number;
}

export function CheckoutSummary({
  cart,
  subtotal,
  delivery,
  total,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl border border-border/40 p-8 shadow-sm sticky top-24 overflow-hidden">
      {/* Ambience */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8 flex items-center gap-2">
        <Package size={14} className="text-primary" /> Order Summary
      </h2>

      <ScrollArea className="max-h-[30vh] md:max-h-[40vh] mb-8 pr-4">
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.cartLineId} className="flex gap-4 group">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-xs font-bold text-foreground uppercase tracking-tight truncate">
                  {item.name}
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">
                  {item.quantity} Pc{item.quantity > 1 ? "s" : ""} •{" "}
                  <PriceDisplay amount={item.unitPrice} />
                </p>
                <p className="text-xs font-bold text-primary truncate mt-1">
                  {Object.values(item.selectedOptions).join(" / ")}
                </p>
              </div>
              <div className="text-xs font-bold text-foreground py-0.5">
                <PriceDisplay amount={item.unitPrice * item.quantity} />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-4 pt-6 border-t border-border/20">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
            Subtotal
          </span>
          <span className="text-sm font-bold text-foreground">
            <PriceDisplay amount={subtotal} />
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
            Delivery
          </span>
          <span className="text-sm font-bold text-foreground">
            {delivery === 0 ? "Free" : <PriceDisplay amount={delivery} />}
          </span>
        </div>

        <div className="h-px bg-border/10 my-4" />

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Total
            </span>
            <p className="text-xs font-bold text-muted-foreground uppercase italic">
              VAT Inclusive (15%)
            </p>
          </div>
          <span className="text-3xl font-bold text-primary tracking-tight">
            <PriceDisplay amount={total} />
          </span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border/10 flex items-start gap-3">
        <Info size={14} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-muted-foreground/60 uppercase leading-relaxed">
          Final pricing confirmed at checkout. Production begins after order
          confirmation.
        </p>
      </div>
    </div>
  );
}

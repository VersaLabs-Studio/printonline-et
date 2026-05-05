"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  cart: {
    name: string;
    quantity: number;
    unitPrice: number;
    priorityPrice?: number;
    designPackageName?: string;
    designPackagePrice?: number;
    /** @deprecated backward compat */
    designerFee?: number;
  }[];
  subtotal: number;
  delivery: number;
  total: number;
}

export function CartSummary({ cart, subtotal, delivery, total }: CartSummaryProps) {
  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" /> Order Summary
        </h2>

        <div className="space-y-5 mb-10">
          <div className="flex flex-col gap-3 pb-4 border-b border-border/10">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
              Invoice Breakdown
            </span>
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 p-2 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-bold text-foreground truncate uppercase tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground shrink-0 uppercase tracking-widest">
                    <PriceDisplay amount={item.unitPrice * item.quantity} />
                  </span>
                </div>
                {item.priorityPrice !== undefined && item.priorityPrice > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-500 uppercase tracking-wider pl-0.5">
                    <span>+ Rush Production</span>
                    <span>+{item.priorityPrice} ETB</span>
                  </div>
                )}
                {item.designPackageName && (item.designPackagePrice || 0) > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-primary uppercase tracking-wider pl-0.5">
                    <span>+ {item.designPackageName}</span>
                    <span>+{(item.designPackagePrice || 0).toLocaleString()} ETB</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center group pt-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Subtotal
            </span>
            <span className="font-bold text-foreground tracking-tight">
              <PriceDisplay amount={subtotal} />
            </span>
          </div>
          {delivery > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Delivery
              </span>
              <span className="font-bold text-foreground tracking-tight">
                <PriceDisplay amount={delivery} />
              </span>
            </div>
          )}
          <div className="h-px bg-border/20 my-4" />

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Total
              </span>
              <p className="text-xs font-bold text-muted-foreground uppercase leading-none italic">
                VAT Inclusive (15%)
              </p>
            </div>
            <span className="text-4xl font-bold text-primary tracking-tight drop-shadow-sm">
              <PriceDisplay amount={total} />
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full h-16 rounded-3xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-4 group active:scale-95 transition-all btn-pana overflow-hidden relative"
        >
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 text-center">Proceed to Checkout</span>
            <div className="ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight size={18} />
            </div>
          </Link>
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-muted/10 border border-border/20 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
          <Truck size={18} className="text-primary opacity-60" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Free Delivery over 5,000 ETB
          </p>
        </div>
      </div>
    </div>
  );
}

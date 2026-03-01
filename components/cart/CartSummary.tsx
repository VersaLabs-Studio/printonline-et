"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  delivery: number;
  total: number;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" /> Order Summary
        </h2>

        {/* Promotional Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-6 flex items-center gap-3 animate-in fade-in">
          <div className="flex-1">
            <p className="text-xs font-bold text-foreground flex items-center gap-2">
              🔥 Free Standard Delivery
            </p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5 tracking-wider">
              Automatic promotional override applied
            </p>
          </div>
          <span className="bg-foreground text-background text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider">
            Active
          </span>
        </div>

        <div className="space-y-5 mb-10">
          <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Subtotal
            </span>
            <span className="font-bold text-foreground tracking-tight">
              <PriceDisplay amount={subtotal} />
            </span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Delivery
            </span>
            <span className="font-bold text-foreground tracking-tight">
              <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider animate-pulse">
                Free
              </span>
            </span>
          </div>

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
          className="w-full btn-pana py-4 text-sm font-semibold uppercase tracking-wider gap-3 active:scale-[0.98] transition-all"
        >
          <Link href="/order-summary">
            Proceed to Checkout
            <ArrowRight
              size={20}
              className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/10 border border-border/20 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
          <Truck size={18} className="text-primary opacity-60" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Free Delivery over 5,000 ETB
          </p>
        </div>
        <div className="bg-muted/10 border border-border/20 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
          <Clock size={18} className="text-primary opacity-60" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            2-Day Production
          </p>
        </div>
      </div>
    </div>
  );
}

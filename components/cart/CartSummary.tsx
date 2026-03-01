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

export function CartSummary({ subtotal, delivery, total }: CartSummaryProps) {
  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/40 p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" /> Order Summary
        </h2>

        <div className="space-y-5 mb-10">
          <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
              Subtotal
            </span>
            <span className="font-black text-foreground tracking-tighter">
              <PriceDisplay amount={subtotal} />
            </span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
              Delivery
            </span>
            <span className="font-black text-foreground tracking-tighter">
              {delivery === 0 ? (
                <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
                  Free
                </span>
              ) : (
                <PriceDisplay amount={delivery} />
              )}
            </span>
          </div>

          <div className="h-px bg-border/20 my-4" />

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Total
              </span>
              <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none italic">
                VAT Inclusive (15%)
              </p>
            </div>
            <span className="text-4xl font-black text-primary tracking-tighter drop-shadow-sm">
              <PriceDisplay amount={total} />
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full h-16 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-4 group active:scale-[0.98] transition-all"
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
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            Free Delivery over 5,000 ETB
          </p>
        </div>
        <div className="bg-muted/10 border border-border/20 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
          <Clock size={18} className="text-primary opacity-60" />
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            2-Day Production
          </p>
        </div>
      </div>
    </div>
  );
}

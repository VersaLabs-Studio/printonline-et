"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ConfirmationHeaderProps {
  orderId: string;
}

export function ConfirmationHeader({ orderId }: ConfirmationHeaderProps) {
  return (
    <div className="text-center space-y-6">
      <div className="relative mx-auto w-24 h-24 bg-emerald-500/10 rounded-4xl flex items-center justify-center text-emerald-500 shadow-inner group">
        <CheckCircle2
          size={48}
          className="animate-in zoom-in group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full animate-pulse" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">
          Your order has been placed successfully and is now being processed.
          We&apos;ll send you updates via email.
        </p>
      </div>

      <div className="inline-flex flex-col items-center gap-1 group">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
          Order Number
        </span>
        <span className="text-2xl font-black tracking-tighter text-primary group-hover:drop-shadow-sm transition-all">
          {orderId}
        </span>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CreditCard, ShieldCheck, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderPaymentStepProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  total: number;
}

export function OrderPaymentStep({
  onBack,
  onSubmit,
  isSubmitting,
  total,
}: OrderPaymentStepProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 shadow-sm relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="space-y-1 relative z-10">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Step 3 of 3
        </h3>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight uppercase flex items-center gap-3">
          <CreditCard className="text-primary" size={24} /> Payment
        </h2>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="p-6 rounded-2xl bg-muted/10 border border-border/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment Method</span>
            <span className="text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
              Chapa (Hosted)
            </span>
          </div>
          
          <div className="divider-pana opacity-20" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Amount</span>
            <span className="text-xl font-bold text-foreground">
              ETB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Secure Transaction</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Your payment is handled securely by Chapa. We do not store your card details.
              </p>
            </div>
          </div>
          
          <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
            Clicking the button below will redirect you to Chapa&apos;s secure payment portal to complete your order. Once finished, you will be automatically returned to our site.
          </p>
        </div>
      </div>

      <div className="pt-2 flex gap-4 relative z-10">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-14 w-20 rounded-2xl border-border/40 hover:bg-muted transition-all shrink-0 active:scale-95"
        >
          <ArrowLeft size={18} />
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-2xl font-semibold uppercase tracking-wider text-sm shadow-sm hover:shadow-xl hover:shadow-primary/20 gap-4 group active:scale-95 transition-all overflow-hidden relative btn-pana"
        >
          {isSubmitting ? (
            <div className="absolute inset-0 flex items-center justify-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="animate-pulse">Redirecting to Chapa...</span>
            </div>
          ) : (
            <>
              Pay & Place Order
              <ExternalLink
                size={18}
                className="ml-auto opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

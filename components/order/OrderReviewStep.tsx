"use client";

import React, { useState } from "react";
import { FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TermsAndConditions } from "@/components/checkout/TermsAndConditions";
import { TERMS_AND_CONDITIONS_CONTENT } from "@/content/terms";

interface OrderReviewStepProps {
  contactInfo: any;
  deliveryAddress: any;
  specialInstructions: string;
  onBack: () => void;
  onSubmit: (termsAccepted: boolean) => void;
  isSubmitting: boolean;
}

export function OrderReviewStep({
  contactInfo,
  deliveryAddress,
  specialInstructions,
  onBack,
  onSubmit,
  isSubmitting,
}: OrderReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-10 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Step 3 of 3
        </h3>
        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
          <FileText className="text-primary" size={28} /> Order Review
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Contact Details
          </h4>
          <div className="p-5 rounded-2xl bg-muted/10 border border-border/10 space-y-1">
            <p className="text-sm font-black text-foreground uppercase tracking-tight">
              {contactInfo.firstName} {contactInfo.lastName}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase opacity-80">
              {contactInfo.email}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase opacity-80">
              {contactInfo.phone}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Delivery Address
          </h4>
          <div className="p-5 rounded-2xl bg-muted/10 border border-border/10 space-y-1">
            <p className="text-sm font-black text-foreground uppercase tracking-tight">
              {deliveryAddress.address}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase opacity-80">
              {deliveryAddress.city}, {deliveryAddress.postalCode}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase opacity-80">
              {deliveryAddress.country}
            </p>
          </div>
        </div>
      </div>

      {specialInstructions && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Special Instructions
          </h4>
          <div className="p-5 rounded-2xl bg-muted/10 border border-border/10">
            <p className="text-xs font-bold text-muted-foreground uppercase italic leading-relaxed">
              &quot;{specialInstructions}&quot;
            </p>
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
        <p className="text-[10px] font-bold text-foreground uppercase leading-relaxed text-center">
          <strong className="text-primary tracking-widest block mb-1">
            Please Note
          </strong>
          Our team will review your order and contact you within 24 hours to
          confirm details and arrange payment.
        </p>
      </div>

      <TermsAndConditions
        content={TERMS_AND_CONDITIONS_CONTENT}
        checked={termsAccepted}
        onCheckedChange={setTermsAccepted}
      />

      <div className="pt-2 flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-14 w-20 rounded-2xl border-border/40 hover:bg-muted transition-all shrink-0"
        >
          <ArrowLeft size={18} />
        </Button>
        <Button
          onClick={() => onSubmit(termsAccepted)}
          disabled={isSubmitting || !termsAccepted}
          className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-4 group active:scale-95 transition-all overflow-hidden relative"
        >
          {isSubmitting ? (
            <div className="absolute inset-0 bg-primary flex items-center justify-center gap-3">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">Placing Order...</span>
            </div>
          ) : (
            <>
              Place Order
              <CheckCircle2
                size={18}
                className="ml-auto opacity-40 group-hover:scale-110 transition-transform"
              />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

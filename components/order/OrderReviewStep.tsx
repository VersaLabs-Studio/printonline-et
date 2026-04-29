"use client";

import React, { useState } from "react";
import { FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TermsCheckbox } from "@/components/checkout/TermsCheckbox";

import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { getDeliveryZone, FREE_DELIVERY_THRESHOLD } from "@/lib/delivery/zones";

interface OrderReviewStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  deliveryMethod: string;
  specialInstructions: string;
  onBack: () => void;
  onSubmit: (termsAccepted: boolean) => void;
  isSubmitting: boolean;
  deliveryFee?: number;
  cartTotal?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deliveryInfo?: any;
}

export function OrderReviewStep({
  profile,
  session,
  deliveryMethod,
  specialInstructions,
  onBack,
  onSubmit,
  isSubmitting,
  deliveryFee = 0,
  cartTotal = 0,
  deliveryInfo,
}: OrderReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isHome = deliveryMethod === "home";
  const isOther = deliveryMethod === "other";
  const isPickup = deliveryMethod === "pickup";

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 shadow-sm relative overflow-hidden">
      <div className="space-y-1 relative z-10">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Step 2 of 2
        </h3>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight uppercase flex items-center gap-3">
          <FileText className="text-primary" size={24} /> Final Review
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60">
            Account Sync
          </h4>
          <div className="p-5 rounded-2xl bg-muted/10 border border-border/20 space-y-1 h-full">
            <p className="text-sm font-semibold text-foreground uppercase tracking-tight">
              {profile?.full_name || session?.user?.name}
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-80 mt-1">
              Email: {session?.user?.email}
            </p>
            {profile?.phone && (
              <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-80">
                Contact: {profile?.phone}
              </p>
            )}
            {profile?.tin_number && (
              <p className="text-[10px] font-semibold text-primary uppercase opacity-60 mt-2 tracking-wider">
                TIN: {profile?.tin_number}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60">
            Fulfillment Network
          </h4>
          <div className="p-5 rounded-2xl bg-muted/10 border border-border/20 space-y-2 h-full">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
              {isHome ? "Standard Delivery" : isOther ? "One-Time Address Delivery" : "Manual Collection"}
            </span>
            {isHome ? (
              <>
                <p className="text-sm font-semibold text-foreground tracking-tight mt-2 line-clamp-1">
                  {profile?.address_line1}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-80">
                  {profile?.city}, {profile?.sub_city}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {cartTotal >= FREE_DELIVERY_THRESHOLD ? (
                    <p className="text-[10px] font-semibold text-emerald-500 uppercase opacity-80 tracking-widest">
                      Free delivery (over {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB)
                    </p>
                  ) : (
                    <>
                      <p className="text-[10px] font-semibold text-foreground uppercase opacity-80 tracking-widest">
                        Delivery Fee:
                      </p>
                      <PriceDisplay amount={deliveryFee} size="sm" className="font-bold" />
                      {profile?.sub_city && getDeliveryZone(profile.sub_city) && (
                        <p className="text-[10px] text-muted-foreground uppercase">
                          ({getDeliveryZone(profile.sub_city)?.description})
                        </p>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : isOther ? (
              <>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-sm inline-block mb-1">
                  One-Time Address
                </span>
                <p className="text-sm font-semibold text-foreground tracking-tight mt-1 line-clamp-2">
                  {deliveryInfo?.altAddress}{deliveryInfo?.altAddressLine2 ? `, ${deliveryInfo.altAddressLine2}` : ""}
                </p>
                {deliveryInfo?.altRecipientName && (
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-80">
                    Recipient: {deliveryInfo.altRecipientName}{deliveryInfo?.altPhone ? ` • ${deliveryInfo.altPhone}` : ""}
                  </p>
                )}
                <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-80">
                  Addis Ababa, {deliveryInfo?.altSubCity}{deliveryInfo?.altWoreda ? ` (Woreda ${deliveryInfo.altWoreda})` : ""}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {cartTotal >= FREE_DELIVERY_THRESHOLD ? (
                    <p className="text-[10px] font-semibold text-emerald-500 uppercase opacity-80 tracking-widest">
                      Free delivery (over {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB)
                    </p>
                  ) : (
                    <>
                      <p className="text-[10px] font-semibold text-foreground uppercase opacity-80 tracking-widest">
                        Delivery Fee:
                      </p>
                      <PriceDisplay amount={deliveryFee} size="sm" className="font-bold" />
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground tracking-tight mt-2">
                  PrintOnline HQ
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-80">
                  Ready for pickup after confirmation
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {specialInstructions && (
        <div className="space-y-4 relative z-10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60">
            Special Instructions Note
          </h4>
          <div className="p-5 rounded-2xl bg-muted/10 border border-border/20">
            <p className="text-xs font-semibold text-muted-foreground uppercase leading-relaxed text-center">
              &quot;{specialInstructions}&quot;
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <TermsCheckbox
          checked={termsAccepted}
          onCheckedChange={setTermsAccepted}
        />
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
          onClick={() => onSubmit(termsAccepted)}
          disabled={isSubmitting || !termsAccepted}
          className="flex-1 h-14 rounded-2xl font-semibold uppercase tracking-wider text-sm shadow-sm hover:shadow-xl hover:shadow-primary/20 gap-4 group active:scale-95 transition-all overflow-hidden relative btn-pana"
        >
          {isSubmitting ? (
            <div className="absolute inset-0 flex items-center justify-center gap-3">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span className="animate-pulse">Placing Order...</span>
            </div>
          ) : (
            <>
              Confirm Order Data
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

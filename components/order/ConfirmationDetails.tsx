"use client";

import React from "react";
import Image from "next/image";
import { User, MapPin, Mail, Phone, Info } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

interface ConfirmationDetailsProps {
  orderDetails: any;
}

export function ConfirmationDetails({
  orderDetails,
}: ConfirmationDetailsProps) {
  const firstItem = orderDetails.order_items?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
      {/* Order Details */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Order Details
          </h3>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative h-40 w-full md:w-40 rounded-3xl overflow-hidden bg-muted/20 border border-border/20 shadow-inner">
              <Image
                src={firstItem?.product_image || "/placeholder.jpg"}
                alt={firstItem?.product_name || "Product"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                  {firstItem?.product_name}
                </h4>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">
                  {firstItem?.category}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-border/10">
                {Object.entries(firstItem?.selected_options || {}).map(
                  ([key, value], idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        {key}
                      </p>
                      <p className="text-xs font-black uppercase tracking-tight text-foreground">
                        {String(value)}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/10 border border-border/10 rounded-[2rem] p-8 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <User size={14} /> Customer
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-tight text-foreground">
                {orderDetails.customer_name}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                <Mail size={12} className="opacity-40" />{" "}
                {orderDetails.customer_email}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                <Phone size={12} className="opacity-40" />{" "}
                {orderDetails.customer_phone || "N/A"}
              </div>
            </div>
          </div>

          <div className="bg-muted/10 border border-border/10 rounded-[2rem] p-8 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <MapPin size={14} /> Delivery Address
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-tight text-foreground">
                {orderDetails.delivery_address}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">
                {orderDetails.delivery_city}, {orderDetails.delivery_sub_city}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">
                Ethiopia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="lg:col-span-4">
        <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/40 p-8 shadow-2xl shadow-primary/5 sticky top-24">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Payment Summary
          </h3>
          <div className="space-y-6 pt-6 border-t border-border/20">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Total Paid
                </span>
                <p className="text-[9px] font-bold text-muted-foreground uppercase italic leading-none">
                  VAT Inclusive (15%)
                </p>
              </div>
              <PriceDisplay
                amount={orderDetails.total_amount || 0}
                className="text-4xl font-black text-primary tracking-tighter"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/10 flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:rotate-12">
              <Info size={14} />
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed opacity-60">
              A confirmation receipt has been sent to your email address. Our
              team will contact you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

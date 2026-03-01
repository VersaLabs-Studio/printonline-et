"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderWithItems } from "@/types";

interface OrderFulfillmentInfoProps {
  order: OrderWithItems;
}

export function OrderFulfillmentInfo({ order }: OrderFulfillmentInfoProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl p-6 bg-muted/5">
      <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
        <MapPin size={14} className="text-primary" /> Fulfillment Logistics
      </h5>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-background border border-border/30 shadow-inner group">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Truck size={10} className="text-primary" /> Delivery Destination
          </p>
          <p className="text-sm font-bold text-foreground/80 leading-relaxed font-mono">
            {order.delivery_address || "Handled at Pana HQ (Addis Ababa)"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-[9px] font-bold uppercase tracking-widest bg-primary/5 border-primary/20 text-primary-700 px-3 py-1 rounded-xl shadow-sm"
          >
            {order.delivery_city || "Addis Ababa"}
          </Badge>
          {order.delivery_sub_city && (
            <Badge
              variant="outline"
              className="text-[9px] font-bold uppercase tracking-widest bg-muted/30 border-border/40 text-muted-foreground px-3 py-1 rounded-xl shadow-sm"
            >
              {order.delivery_sub_city}
            </Badge>
          )}
        </div>

        {order.payment_method && (
          <div className="pt-2">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
              Payment Gateway
            </p>
            <Badge
              variant="secondary"
              className="font-bold text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1"
            >
              {order.payment_method}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}

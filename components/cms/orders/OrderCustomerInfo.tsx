"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, Building2 } from "lucide-react";
import { OrderWithItems } from "@/types";

interface OrderCustomerInfoProps {
  order: OrderWithItems;
}

export function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl p-6 bg-muted/5">
      <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
        <User size={14} className="text-primary" /> Customer Profile
      </h5>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground flex items-center justify-center font-black text-lg">
            {order.customer_name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black tracking-tight text-foreground truncate">
              {order.customer_name}
            </p>
            <p className="text-[11px] text-muted-foreground font-bold truncate tracking-tight">
              {order.customer_email}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <ContactItem
            icon={Mail}
            label="Email Address"
            value={order.customer_email}
          />
          <ContactItem
            icon={Phone}
            label="Contact Phone"
            value={order.customer_phone || "Not Provided"}
          />
          {order.customer_tin && (
            <ContactItem
              icon={Building2}
              label="TIN Number"
              value={order.customer_tin}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 group">
      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none flex items-center gap-1.5 px-0.5">
        <Icon size={10} className="text-primary/60" /> {label}
      </span>
      <p className="text-xs font-bold text-foreground/80 bg-background/50 border border-border/20 rounded-lg px-2.5 py-1.5 shadow-sm group-hover:border-primary/20 transition-colors">
        {value}
      </p>
    </div>
  );
}

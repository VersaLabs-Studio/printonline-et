"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, Building2, MapPin, ExternalLink, Hash } from "lucide-react";
import { OrderWithItems } from "@/types/database";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderCustomerInfoProps {
  order: OrderWithItems;
}

export function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  const customer = order.customer;

  return (
    <Card className="border-border/40 shadow-sm rounded-2xl p-6 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <User size={80} />
      </div>

      <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
        <User size={14} /> Customer
      </h5>

      <div className="space-y-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground flex items-center justify-center font-bold text-xl tracking-tighter">
            {order.customer_name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-base font-bold tracking-tight text-foreground truncate">
              {order.customer_name}
            </p>
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-70">
              ID: {(customer?.id || order.customer_id || "GUEST").substring(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          <ContactItem
            icon={Mail}
            label="Email"
            value={order.customer_email}
          />
          <ContactItem
            icon={Phone}
            label="Phone"
            value={order.customer_phone || "Not provided"}
          />
          {(order.customer_tin || customer?.tin_number) && (
            <ContactItem
              icon={Hash}
              label="TIN Number"
              value={order.customer_tin || customer?.tin_number || ""}
            />
          )}
          {(customer?.company_name) && (
            <ContactItem
              icon={Building2}
              label="Company"
              value={customer?.company_name}
            />
          )}
          {(customer?.address_line1) && (
            <ContactItem
              icon={MapPin}
              label="Address"
              value={`${customer.address_line1}${customer.city ? `, ${customer.city}` : ""}`}
            />
          )}
        </div>

        {order.customer_id && (
          <Button
            asChild
            variant="outline"
            className="w-full mt-2 h-10 rounded-xl border-border/60 font-bold uppercase tracking-widest text-[9px] gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
          >
            <Link href={`/cms/customers/${order.customer_id}`}>
              View Customer <ExternalLink size={12} />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 group/item">
      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-none flex items-center gap-2 px-0.5">
        <Icon size={12} className="text-primary/40 group-hover/item:text-primary transition-colors" /> {label}
      </span>
      <p className="text-xs font-semibold text-foreground/80 bg-muted/30 border border-border/20 rounded-xl px-4 py-2 transition-all group-hover/item:border-primary/20 group-hover/item:bg-background">
        {value}
      </p>
    </div>
  );
}

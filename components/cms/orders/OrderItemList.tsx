"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { OrderWithItems } from "@/types";

interface OrderItemListProps {
  order: OrderWithItems;
}

export function OrderItemList({ order }: OrderItemListProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <ShoppingCart size={16} className="text-primary" /> Order Items (
          {order.order_items?.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="p-6 flex gap-4 items-start hover:bg-muted/5 transition-colors"
            >
              <div className="h-16 w-16 rounded-xl bg-muted border border-border/40 overflow-hidden flex-shrink-0 shadow-inner">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <ShoppingCart size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <h4 className="font-black text-sm tracking-tight">
                    {item.product_name}
                  </h4>
                  <PriceDisplay
                    amount={item.line_total}
                    className="text-sm font-black text-primary"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {item.quantity} x <PriceDisplay amount={item.unit_price} />
                </p>
                {item.selected_options && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.entries(
                      item.selected_options as Record<string, string>,
                    ).map(([key, val]) => (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="text-[9px] font-black uppercase px-2 py-0.5 bg-muted/60 border-border/20 shadow-sm"
                      >
                        {key}: {val}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-muted/10 p-6 space-y-3 border-t border-border/40">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">
              Subtotal
            </span>
            <PriceDisplay amount={order.subtotal} className="font-bold" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">
              Taxes & Fees
            </span>
            <PriceDisplay
              amount={order.tax_amount || 0}
              className="font-bold"
            />
          </div>
          <div className="flex justify-between text-lg pt-3 border-t-2 border-dashed border-border/40">
            <span className="font-black uppercase tracking-widest text-xs">
              Total Amount
            </span>
            <PriceDisplay
              amount={order.total_amount}
              className="font-black text-primary text-xl"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

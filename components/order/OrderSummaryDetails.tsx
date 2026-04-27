"use client";

import React from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { FileText, Package, Truck, Store } from "lucide-react";

import { getDeliveryZone, FREE_DELIVERY_THRESHOLD, getQuantityMultiplier } from "@/lib/delivery/zones";

interface OrderSummaryDetailsProps {
  cartItems?: any[];
  total?: number;
  orderItem?: any;
  deliveryFee?: number;
  deliveryMethod?: "home" | "pickup";
  subCity?: string | null;
  cartCount?: number;
}

export function OrderSummaryDetails({
  cartItems,
  total,
  orderItem,
  deliveryFee = 0,
  deliveryMethod = "home",
  subCity,
  cartCount = 0,
}: OrderSummaryDetailsProps) {
  const getDisplayOptions = (options: Record<string, unknown>) => {
    return Object.entries(options)
      .filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          _ !== "quantity",
      )
      .map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        value:
          typeof value === "boolean" ? (value ? "Yes" : "No") : String(value),
      }));
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm sticky top-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8 flex items-center gap-2">
        <Package size={14} className="text-primary" /> Your Items
      </h2>

      {cartItems ? (
        <div className="space-y-6 mb-10">
          {cartItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase truncate">
                  {item.name}{" "}
                  <span className="text-muted-foreground ml-1">
                    x{item.quantity}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground uppercase truncate mt-1">
                  {Object.entries(item.selectedOptions || {})
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </p>
                <PriceDisplay
                  amount={item.unitPrice * item.quantity + (item.priorityPrice || 0) + (item.designerFee || 0)}
                  size="sm"
                  className="mt-1"
                />
                {item.priorityPrice > 0 && (
                  <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">
                    + Rush Production: {item.priorityPrice} ETB
                  </p>
                )}
                {item.designerFee > 0 && (
                  <p className="text-[10px] font-bold text-primary uppercase mt-1">
                    + Hire Designer: {item.designerFee} ETB
                  </p>
                )}
                {item.designFileNames && item.designFileNames.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {item.designFileNames.map((fname: string, idx: number) => (
                      <p key={idx} className="text-[9px] font-bold text-primary uppercase flex items-center gap-1">
                        <FileText size={10} /> {fname}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        orderItem && (
          <div className="space-y-4 mb-10">
            <div className="flex gap-6 mb-8">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shrink-0 shadow-inner">
                <Image
                  src={orderItem.productImage as string}
                  alt={orderItem.productName as string}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 py-1">
                <h3 className="text-lg font-semibold tracking-tight text-foreground uppercase">
                  {orderItem.productName}
                </h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider opacity-60">
                  {orderItem.category}
                </p>
              </div>
            </div>
            {getDisplayOptions(orderItem.customOptions || {}).map(
              (option, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center group py-1 border-b border-border/10 last:border-0 pb-3"
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                    {option.label}
                  </span>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-tight">
                    {option.value}
                  </span>
                </div>
              ),
            )}
          </div>
        )
      )}

      {(orderItem?.designFile || orderItem?.designFileNames) && (
        <div className="mb-10 p-4 rounded-2xl bg-muted/20 border border-border/20 space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attached Assets</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {orderItem?.designFile && (
              <div className="flex items-center gap-4 p-2 rounded-xl bg-background border border-border/10">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-foreground uppercase truncate">
                    {orderItem.designFile.name}
                  </p>
                </div>
              </div>
            )}
            {orderItem?.designFileNames?.map((fname: string, idx: number) => (
              <div key={idx} className="flex items-center gap-4 p-2 rounded-xl bg-background border border-border/10">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-foreground uppercase truncate">
                    {fname}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-border/20">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Subtotal
            </span>
            <PriceDisplay
              amount={(total || 0) - deliveryFee}
              className="text-sm font-semibold text-foreground"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
              {deliveryMethod === "pickup" ? (
                <Store size={12} className="text-amber-500" />
              ) : (
                <Truck size={12} className="text-emerald-500" />
              )}
              {deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
              {deliveryMethod === "home" && subCity && (
                <span className="text-[10px] normal-case opacity-60">
                  ({subCity})
                </span>
              )}
            </span>
            <PriceDisplay
              amount={deliveryFee}
              className="text-sm font-semibold text-foreground"
            />
          </div>
          {deliveryMethod === "home" && deliveryFee === 0 && (total || 0) >= FREE_DELIVERY_THRESHOLD && (
            <p className="text-[10px] font-bold text-emerald-500 uppercase text-right">
              Free delivery (order over {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB)
            </p>
          )}
          {deliveryMethod === "home" && deliveryFee === 0 && (total || 0) < FREE_DELIVERY_THRESHOLD && subCity && (
            <p className="text-[10px] font-bold text-amber-500 uppercase text-right">
              {getDeliveryZone(subCity)
                ? "Enter a valid sub-city for delivery fee"
                : "Sub-city not in delivery zone"}
            </p>
          )}
          {deliveryMethod === "home" && deliveryFee > 0 && subCity && getDeliveryZone(subCity) && cartCount > 0 && (
            <p className="text-[10px] text-muted-foreground uppercase text-right">
              {(() => {
                const zone = getDeliveryZone(subCity);
                const baseFee = zone?.baseFee ?? 0;
                const multiplier = getQuantityMultiplier(cartCount);
                const discount = baseFee - deliveryFee;
                if (discount > 0) {
                  return `Base ${baseFee} ETB · Bulk discount -${discount} ETB (${cartCount} items)`;
                }
                return `Base ${baseFee} ETB · ${zone?.description}`;
              })()}
            </p>
          )}
        </div>
        <div className="pt-4 border-t border-border/20">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Order Total
              </span>
              <p className="text-xs font-medium text-muted-foreground uppercase italic leading-none">
                VAT Inclusive (15%)
              </p>
            </div>
            <PriceDisplay
              amount={total !== undefined ? total : orderItem?.totalPrice || 0}
              className="text-2xl font-semibold text-primary tracking-tight drop-shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

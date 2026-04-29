"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Layers } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: any; // Using any for now to match current CartItem type
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  isUpdating?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemProps) {
  return (
    <div
      className={cn(
        "group relative bg-card/40 backdrop-blur-sm rounded-2xl border border-border/40 p-6 transition-all hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5",
        isUpdating && "opacity-50 pointer-events-none",
      )}
    >
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Visual Asset */}
        <div className="relative h-40 w-full sm:w-40 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Intelligence Data */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                  <Layers size={12} /> {item.category}
                </span>
              </div>
              <Link
                href={`/products/${item.productSlug}`}
                className="text-xl font-bold text-foreground tracking-tight hover:text-primary transition-colors block leading-tight truncate max-w-md"
              >
                {item.name}
              </Link>
            </div>
            <button
              onClick={() => onRemove(item.cartLineId)}
              className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 border border-transparent transition-all active:scale-95"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Configuration Summary */}
          {item.selectedOptions &&
            Object.entries(item.selectedOptions).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(item.selectedOptions).map(([key, value]) => (
                  <div
                    key={key}
                    className="px-3 py-1.5 rounded-lg bg-muted text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border border-border/10"
                  >
                    <span className="opacity-40 mr-1.5">{key}:</span>
                    {String(value)}
                  </div>
                ))}
                {item.designFileNames && item.designFileNames.length > 0 && (
                  <div className="px-3 py-1.5 rounded-lg bg-primary/5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/10">
                    Linked Assets: {item.designFileNames.join(", ")}
                  </div>
                )}
                {item.priorityPrice > 0 && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/5 text-xs font-bold uppercase tracking-wider text-emerald-500 border border-emerald-500/10">
                    Rush Production: +{item.priorityPrice} ETB
                  </div>
                )}
                {item.designPackageName && (
                  <div className="px-3 py-1.5 rounded-lg bg-primary/5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/10">
                    {item.designPackageName}: +{(item.designPackagePrice || 0).toLocaleString()} ETB
                  </div>
                )}
              </div>
            )}

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/20">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                Quantity
              </span>
              <span className="px-4 py-1.5 rounded-xl bg-muted/50 border border-border/10 font-bold text-sm tracking-tight">
                {item.quantity}
              </span>
            </div>
            <div className="text-2xl font-bold text-primary tracking-tight">
              <PriceDisplay amount={item.unitPrice * item.quantity + (item.priorityPrice || 0) + (item.designPackagePrice || item.designerFee || 0)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

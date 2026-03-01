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
        "group relative bg-card/40 backdrop-blur-sm rounded-[2rem] border border-border/40 p-6 transition-all hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5",
        isUpdating && "opacity-50 pointer-events-none",
      )}
    >
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Visual Asset */}
        <div className="relative h-40 w-full sm:w-40 rounded-3xl overflow-hidden bg-muted/20 border border-border/20 shrink-0">
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
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5">
                  <Layers size={12} /> {item.category}
                </span>
              </div>
              <Link
                href={`/products/${item.productSlug}`}
                className="text-xl font-black text-foreground tracking-tighter hover:text-primary transition-colors block leading-tight truncate max-w-md"
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
                    className="px-3 py-1.5 rounded-lg bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 border border-border/10"
                  >
                    <span className="opacity-40 mr-1.5">{key}:</span>
                    {String(value)}
                  </div>
                ))}
                {item.designFileName && (
                  <div className="px-3 py-1.5 rounded-lg bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                    Linked Asset: {item.designFileName}
                  </div>
                )}
              </div>
            )}

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/20">
            <div className="flex items-center bg-muted/30 rounded-xl p-1 border border-border/20">
              <button
                onClick={() =>
                  onUpdateQuantity(item.cartLineId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-background transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-black text-xs uppercase tracking-widest">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQuantity(item.cartLineId, item.quantity + 1)
                }
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-background transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="text-2xl font-black text-primary tracking-tighter">
              <PriceDisplay amount={item.unitPrice * item.quantity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

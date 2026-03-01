"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingBag, Trash2, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { cart, removeFromCart, getCartTotal } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = getCartTotal();

  if (!mounted) {
    return (
      <button className="relative p-2.5 rounded-2xl hover:bg-muted transition-all group">
        <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
      </button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2.5 rounded-2xl hover:bg-muted transition-all group">
          <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
          {itemCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/40 bg-background/95 backdrop-blur-md">
        <SheetHeader className="p-6 border-b border-border/40 bg-muted/5">
          <SheetTitle className="flex items-center gap-3 font-bold uppercase tracking-widest text-sm">
            <Package size={18} className="text-primary" />
            Shopping Cart
            <span className="ml-auto text-[10px] text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded-full">
              {itemCount} ITEMS
            </span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          {cart.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center text-muted-foreground/30">
                <ShoppingBag size={40} />
              </div>
              <div className="space-y-1">
                <p className="font-bold uppercase tracking-widest text-xs">
                  Your Cart is Empty
                </p>
                <p className="text-xs text-muted-foreground font-bold max-w-[180px]">
                  Browse our catalog to add products to your cart.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                <Link href="/all-products">Browse Collections</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/20 py-2">
              {cart.map((item, idx) => (
                <div
                  key={item.cartLineId || `drawer-item-${idx}`}
                  className="py-6 flex gap-4 animate-in fade-in slide-in-from-right-4 duration-300"
                >
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted/20 border border-border/40 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-sm tracking-tight truncate uppercase">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-bold text-muted-foreground line-clamp-1 uppercase tracking-wider">
                      {Object.values(item.selectedOptions || {}).join(" • ")}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-bold text-primary">
                        <PriceDisplay amount={item.unitPrice * item.quantity} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold mr-2 opacity-40 uppercase">
                          QTY: {item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartLineId)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-colors text-muted-foreground"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <SheetFooter className="mt-auto p-6 bg-muted/10 border-t border-border/40 space-y-4 flex-col items-stretch">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="text-2xl font-bold tracking-tighter text-primary">
                <PriceDisplay amount={total} />
              </span>
            </div>
            <Button
              asChild
              className="w-full h-14 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-3 group"
            >
              <Link href="/checkout">
                Secure Checkout
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform opacity-40"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-[11px] border-border/40 hover:bg-muted transition-all"
            >
              <Link href="/cart">Review Full Cart</Link>
            </Button>
            <p className="text-[9px] text-center font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-2">
              VAT included • Production begins after order confirmation
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

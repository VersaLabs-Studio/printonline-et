"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { SafeMotionDiv } from "@/components/shared/SafeMotion";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getDeliveryFee,
  } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = (cartLineId: string, quantity: number) => {
    setIsUpdating(cartLineId);
    try {
      updateQuantity(cartLineId, quantity);
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = (cartLineId: string) => {
    removeFromCart(cartLineId);
    toast.success("Item removed from cart");
  };

  const subtotal = getCartTotal();
  const shipping = getDeliveryFee();
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col gap-10">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
            <div className="space-y-4">
              <Link
                href="/all-products"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-4 group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Continue Shopping
              </Link>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground uppercase">
                Shopping Cart
              </h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider border border-primary/10">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 hover:text-rose-500 transition-colors pb-1 border-b border-transparent hover:border-rose-500/30"
            >
              <Trash2 size={12} /> Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, idx) => (
                <SafeMotionDiv
                  key={item.cartLineId || `cart-item-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    isUpdating={isUpdating === item.cartLineId}
                  />
                </SafeMotionDiv>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                cart={cart}
                subtotal={subtotal}
                delivery={shipping}
                total={total}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              Checkout Total
            </span>
            <span className="text-xl font-black text-primary tracking-tighter">
              <PriceDisplay amount={total} />
            </span>
          </div>
          <Button
            asChild
            className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs btn-pana shadow-xl shadow-primary/20"
          >
            <Link href="/checkout">Checkout Now</Link>
          </Button>
        </div>
      </main>

      {/* Spacer for bottom CTA on mobile */}
      <div className="h-28 lg:hidden" />
    </div>
  );
}

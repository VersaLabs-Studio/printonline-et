// app/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { formatETB } from "@/lib/currency";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (cartLineId: string, quantity: number) => {
    setIsUpdating(cartLineId);
    try {
      updateQuantity(cartLineId, quantity);
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (cartLineId: string) => {
    try {
      removeFromCart(cartLineId);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      clearCart();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over 5000 ETB
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any products to your cart yet.
            Browse our catalog to find the perfect printing solutions for your
            needs.
          </p>
          <Link
            href="/all-products"
            className="btn-pana inline-flex items-center p-3"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartLineId}
              className="bg-card rounded-xl shadow-sm p-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                      {/* Show selected options */}
                      {Object.entries(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.selectedOptions).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground"
                              >
                                {key}: {value}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                      {item.designFileName && (
                        <p className="text-xs text-primary mt-1">
                          📎 {item.designFileName}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.cartLineId)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.cartLineId,
                            item.quantity - 1,
                          )
                        }
                        disabled={
                          isUpdating === item.cartLineId || item.quantity <= 1
                        }
                        className="p-1 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.cartLineId,
                            item.quantity + 1,
                          )
                        }
                        disabled={isUpdating === item.cartLineId}
                        className="p-1 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <PriceDisplay
                      amount={item.unitPrice * item.quantity}
                      size="md"
                      className="font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cart Actions */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handleClearCart}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
            <Link
              href="/all-products"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatETB(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-foreground">
                  {shipping === 0 ? "Free" : formatETB(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <div className="text-sm text-green-600 font-medium">
                  You&apos;ve qualified for free delivery!
                </div>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <PriceDisplay amount={total} size="lg" />
                </div>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/checkout")}
              className="w-full btn-pana py-3 mb-3"
            >
              Proceed to Checkout
            </button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Prices shown in Ethiopian Birr (ETB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummaryDetails } from "@/components/order/OrderSummaryDetails";
import { OrderReviewStep } from "@/components/order/OrderReviewStep";
import { OrderProfileSection } from "@/components/order/OrderProfileSection";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function OrderSummaryPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Ethiopia",
  });
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    // Cart context serves the items directly
  }, []);

  const handlePlaceOrder = async (termsAccepted: boolean) => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customer_name: `${contactInfo.firstName} ${contactInfo.lastName}`,
        customer_email: contactInfo.email,
        customer_phone: contactInfo.phone,
        customer_tin: "",
        delivery_address: deliveryAddress.address,
        delivery_city: deliveryAddress.city,
        delivery_sub_city: deliveryAddress.state,
        special_instructions: specialInstructions,
        subtotal: getCartTotal(),
        total_amount: getCartTotal(),
        terms_accepted: termsAccepted,
        items: cart.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          line_total: item.unitPrice * item.quantity,
          selected_options: item.selectedOptions,
          product_image: item.image,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to place order.");
      }

      const { order } = await res.json();

      // Trigger email
      await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order_confirmation",
          order_id: order.id,
        }),
      });

      clearCart();
      setIsSubmitting(false);
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation?order=${order.order_number}`);
    } catch {
      setIsSubmitting(false);
      toast.error("An error occurred during checkout. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-32 w-32 bg-muted/20 rounded-[3rem] flex items-center justify-center text-muted-foreground/30 shadow-inner">
          <Package size={64} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground font-medium">
            Add some products to your cart before checking out.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          <Link href="/all-products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="space-y-4 px-1">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back to Cart
            </Link>
            <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            <div className="lg:col-span-7 xl:col-span-8">
              <AnimatePresence mode="wait">
                {step <= 2 ? (
                  <motion.div
                    key="profile-sections"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <OrderProfileSection
                      step={step}
                      contactInfo={contactInfo}
                      setContactInfo={setContactInfo}
                      deliveryAddress={deliveryAddress}
                      setDeliveryAddress={setDeliveryAddress}
                      specialInstructions={specialInstructions}
                      setSpecialInstructions={setSpecialInstructions}
                      onNext={() => setStep(step + 1)}
                      onBack={() => setStep(step - 1)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="review-step"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                  >
                    <OrderReviewStep
                      contactInfo={contactInfo}
                      deliveryAddress={deliveryAddress}
                      specialInstructions={specialInstructions}
                      onBack={() => setStep(2)}
                      onSubmit={handlePlaceOrder}
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummaryDetails cartItems={cart} total={getCartTotal()} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

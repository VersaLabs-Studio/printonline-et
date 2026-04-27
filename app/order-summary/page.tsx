"use client";

import React, { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Package, ArrowLeft, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummaryDetails } from "@/components/order/OrderSummaryDetails";
import { OrderReviewStep } from "@/components/order/OrderReviewStep";
import { OrderProfileSection } from "@/components/order/OrderProfileSection";
import { SafeMotionDiv, SafeAnimatePresence } from "@/components/shared/SafeMotion";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import { uploadDesignFiles, type UploadedFile } from "@/lib/supabase/storage";
import { OrderPaymentStep } from "@/components/order/OrderPaymentStep";
import { useSearchParams } from "next/navigation";

function OrderSummaryContent() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "1");
  
  const { cart, getCartTotal, getCartCount, localFiles, deliveryInfo, setDeliveryInfo, getDeliveryFee } = useCart();
  const [step, setStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const supabase = createClient();
  const [profile, setProfile] = useState<
    import("@/types/database").Database["public"]["Tables"]["customer_profiles"]["Row"] | null
  >(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Sync delivery method with cart context
  const [localDeliveryMethod, setLocalDeliveryMethod] = useState(deliveryInfo.deliveryMethod);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleDeliveryMethodChange = (method: string) => {
    setLocalDeliveryMethod(method);
    setDeliveryInfo({ ...deliveryInfo, deliveryMethod: method as 'home' | 'pickup' });
  };

  const handleSubCityChange = (subCity: string | null) => {
    setDeliveryInfo({ ...deliveryInfo, subCity });
  };

  const handleProfileUpdate = (updated: Record<string, unknown>) => {
    setProfile(updated as typeof profile);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        setIsProfileLoading(true);
        const { data } = await supabase
          .from("customer_profiles")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .single();
        if (data) {
          setProfile(data);
          // Sync sub-city from profile to delivery info
          if (data.sub_city && !deliveryInfo.subCity) {
            setDeliveryInfo({ ...deliveryInfo, subCity: data.sub_city });
          }
        } else {
          // Fallback if no profile is completely registered
          setProfile({
            id: crypto.randomUUID(),
            auth_user_id: session.user.id,
            full_name: session.user.name || "Guest Account",
            email: session.user.email || "",
            phone: null,
            tin_number: null,
            company_name: null,
            address_line1: null,
            address_line2: null,
            city: "Addis Ababa",
            sub_city: null,
            woreda: null,
            country: "Ethiopia",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        setIsProfileLoading(false);
      }
    }
    if (!isSessionPending && session) {
      fetchProfile();
    }
  }, [session, isSessionPending, supabase]);

  const handlePaymentInitiation = async (termsAccepted: boolean) => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    if (!profile) return;

    try {
      setIsSubmitting(true);

      const isHome = localDeliveryMethod === "home";
      const address = isHome
        ? profile.address_line1
        : "PrintOnline HQ (Pickup)";
      const city = isHome ? profile.city : "Addis Ababa";
      const subCity = isHome ? profile.sub_city : "Bole";

      // Use cart context's delivery fee calculation
      const deliveryFee = getDeliveryFee();
      const subtotal = getCartTotal();
      const totalAmount = subtotal + deliveryFee;

      // 1. Upload files for each cart item
      const itemAssetsMap: Record<string, UploadedFile[]> = {};
      
      for (const item of cart) {
        const files = localFiles[item.cartLineId] || [];
        if (files.length > 0) {
          const uploaded = await uploadDesignFiles(item.cartLineId, files);
          itemAssetsMap[item.cartLineId] = uploaded;
        }
      }

      const orderPayload = {
        customer_name: profile.full_name || session?.user?.name,
        customer_email: session?.user?.email,
        customer_phone: profile.phone || "",
        customer_tin: profile.tin_number || "",
        delivery_address: address,
        delivery_city: city,
        delivery_sub_city: subCity,
        special_instructions: specialInstructions,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        terms_accepted: termsAccepted,
        items: cart.map((item) => {
          const uploadedAssets = itemAssetsMap[item.cartLineId] || [];
          return {
            product_id: item.productId,
            product_name: item.name,
            unit_price: item.unitPrice,
            quantity: item.quantity,
            line_total: item.unitPrice * item.quantity + (item.priorityPrice || 0),
            selected_options: {
              ...item.selectedOptions,
              ...(item.priorityPrice ? { "Production Speed": "Rush" } : {}),
              ...(item.hireDesigner ? { Service: "Pana Designer" } : {}),
            },
            design_preference: item.hireDesigner ? "hire_designer" : "upload",
            design_file_url: uploadedAssets[0]?.url || null,
            design_file_name: uploadedAssets[0]?.name || null,
            design_file_size: uploadedAssets[0]?.size || null,
            assets: uploadedAssets.map((asset) => ({
              file_url: asset.url,
              file_name: asset.name,
              file_size: asset.size,
            })),
            product_image: item.image,
          };
        }),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      if (data.checkout_url) {
        // DO NOT clear cart here. Only clear on confirmation page after success.
        setIsSubmitting(false);
        toast.success("Order initiated. Redirecting to secure payment...");
        
        // Short delay for the toast to be readable
        setTimeout(() => {
          window.location.href = data.checkout_url;
        }, 1500);
      } else {
        throw new Error("No checkout URL received from Chapa.");
      }
    } catch (error: unknown) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during checkout. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="h-32 w-32 bg-muted/20 rounded-4xl flex items-center justify-center text-muted-foreground/30 shadow-inner">
          <Package size={64} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight uppercase">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground font-semibold">
            Add some products to your cart before checking out.
          </p>
        </div>
        <Button
          asChild
          className="h-14 px-8 rounded-2xl font-semibold uppercase tracking-wider text-xs"
        >
          <Link href="/all-products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  if (isSessionPending || isProfileLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-semibold text-muted-foreground animate-pulse uppercase tracking-widest text-xs">
          Authenticating & Syncing Profile...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] bg-background relative overflow-hidden flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="mx-auto h-24 w-24 bg-primary/10 rounded-4xl flex items-center justify-center text-primary mb-8 shadow-inner border border-primary/20">
            <Lock size={40} />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight uppercase">
              Authentication Required
            </h1>
            <p className="text-muted-foreground font-medium text-sm px-4 leading-relaxed">
              You must be logged in to securely save your order and connect it
              to your account dashboard for priority tracking.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-4">
            <Button
              asChild
              className="w-full h-14 btn-pana text-sm font-semibold tracking-widest uppercase shadow-xl shadow-primary/20"
            >
              <Link href={`/login?redirect=/order-summary`}>
                Login to Continue
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full h-14 rounded-2xl font-semibold uppercase tracking-widest text-xs border-border/40 hover:bg-muted transition-all"
            >
              <Link href={`/register?redirect=/order-summary`}>
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="space-y-4 px-1">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back to Cart
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground uppercase">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            <div className="lg:col-span-7 xl:col-span-8">
              <SafeAnimatePresence mode="wait">
                {step === 1 ? (
                  <SafeMotionDiv
                    key="step-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <OrderProfileSection
                      profile={profile}
                      session={session}
                      deliveryMethod={localDeliveryMethod}
                      setDeliveryMethod={handleDeliveryMethodChange}
                      specialInstructions={specialInstructions}
                      setSpecialInstructions={setSpecialInstructions}
                      onNext={() => setStep(2)}
                      onProfileUpdate={handleProfileUpdate}
                      onSubCityChange={handleSubCityChange}
                      cartTotal={getCartTotal()}
                      cartCount={getCartCount()}
                    />
                  </SafeMotionDiv>
                ) : step === 2 ? (
                  <SafeMotionDiv
                    key="step-2"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                  >
                    <OrderReviewStep
                      profile={profile}
                      session={session}
                      deliveryMethod={localDeliveryMethod}
                      specialInstructions={specialInstructions}
                      onBack={() => setStep(1)}
                      onSubmit={() => setStep(3)}
                      isSubmitting={isSubmitting}
                      deliveryFee={getDeliveryFee()}
                      cartTotal={getCartTotal()}
                    />
                  </SafeMotionDiv>
                ) : (
                  <SafeMotionDiv
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <OrderPaymentStep
                      onBack={() => setStep(2)}
                      onSubmit={() => handlePaymentInitiation(true)}
                      isSubmitting={isSubmitting}
                      total={getCartTotal()}
                    />
                  </SafeMotionDiv>
                )}
              </SafeAnimatePresence>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummaryDetails
                cartItems={cart}
                total={getCartTotal() + getDeliveryFee()}
                deliveryFee={getDeliveryFee()}
                deliveryMethod={localDeliveryMethod as "home" | "pickup"}
                subCity={deliveryInfo.subCity}
                cartCount={getCartCount()}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderSummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-semibold text-muted-foreground animate-pulse uppercase tracking-widest text-xs">
            Loading checkout...
          </p>
        </div>
      }
    >
      <OrderSummaryContent />
    </Suspense>
  );
}

// app/order-summary/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Truck,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  category: string;
  customOptions: Record<string, unknown>;
  designFile?: { name: string; size: number } | null;
}

export default function OrderSummaryPage() {
  const router = useRouter();
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact form state
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Ethiopia",
  });

  // Special instructions
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Load order item from sessionStorage
  useEffect(() => {
    const savedOrder = sessionStorage.getItem("pendingOrder");
    if (savedOrder) {
      try {
        setOrderItem(JSON.parse(savedOrder));
      } catch (error) {
        console.error("Failed to parse order:", error);
      }
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contactInfo.email ||
      !contactInfo.firstName ||
      !contactInfo.lastName ||
      !contactInfo.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.postalCode
    ) {
      toast.error("Please fill in all required delivery fields");
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order submission
    setTimeout(() => {
      // Store order confirmation data
      sessionStorage.setItem(
        "orderConfirmation",
        JSON.stringify({
          orderId: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          item: orderItem,
          contact: contactInfo,
          delivery: deliveryAddress,
          specialInstructions,
        }),
      );

      // Clear pending order
      sessionStorage.removeItem("pendingOrder");

      setIsSubmitting(false);
      toast.success("Order placed successfully!");
      router.push("/order-confirmation");
    }, 1500);
  };

  // Format option value for display
  const formatOptionValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Filter and format custom options for display
  const getDisplayOptions = (options: Record<string, unknown>) => {
    return Object.entries(options)
      .filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          key !== "quantity",
      )
      .map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        value: formatOptionValue(key, value),
      }));
  };

  if (!orderItem) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            No Order Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven&apos;t selected a product yet. Browse our
            catalog to find the perfect printing solution for your needs.
          </p>
          <Link
            href="/all-products"
            className="btn-pana inline-flex items-center py-3 px-6"
          >
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Order Summary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: "Contact Info" },
              { num: 2, label: "Delivery" },
              { num: 3, label: "Confirm" },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s.num
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">
                  {s.label}
                </span>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-colors ${
                      step > s.num ? "bg-primary" : "bg-secondary"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Contact Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">
                  Contact Information
                </h2>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactInfo.firstName}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactInfo.lastName}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-pana py-3 px-6">
                  Continue to Delivery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Delivery Address */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center mb-6">
                <Truck className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">
                  Delivery Address
                </h2>
              </div>

              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={deliveryAddress.address}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          address: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.postalCode}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={deliveryAddress.country}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors inline-flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                  <button type="submit" className="btn-pana py-3 px-6">
                    Review Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-xl font-semibold text-foreground">
                  Review Your Order
                </h2>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Contact Summary */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Contact Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.firstName} {contactInfo.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.phone}
                  </p>
                </div>

                {/* Delivery Summary */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {deliveryAddress.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deliveryAddress.city}
                    {deliveryAddress.state &&
                      `, ${deliveryAddress.state}`},{" "}
                    {deliveryAddress.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deliveryAddress.country}
                  </p>
                  {specialInstructions && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Note: {specialInstructions}
                    </p>
                  )}
                </div>

                {/* Order Confirmation Notice */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Next Steps:</strong> After placing your order, our
                    team will contact you within 24 hours to confirm the details
                    and provide pricing based on your specifications.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors inline-flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-pana py-3 px-6 disabled:opacity-50"
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                    {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Order Details
            </h2>

            {/* Product Info */}
            <div className="flex items-start space-x-4 pb-4 border-b border-border">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={orderItem.productImage}
                  alt={orderItem.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {orderItem.productName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {orderItem.category}
                </p>
              </div>
            </div>

            {/* Custom Options */}
            <div className="py-4 space-y-3">
              <h3 className="font-medium text-foreground">Selected Options</h3>
              {getDisplayOptions(orderItem.customOptions).map((option, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
                >
                  <span className="text-muted-foreground">{option.label}</span>
                  <span className="text-foreground font-medium">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Design File */}
            {orderItem.designFile && (
              <div className="py-4 border-t border-border">
                <h3 className="font-medium text-foreground mb-3">
                  Design Artwork
                </h3>
                <div className="flex items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <FileText className="h-5 w-5 text-primary mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {orderItem.designFile.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {(orderItem.designFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Notice */}
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Final pricing will be provided after our team reviews your order
                specifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

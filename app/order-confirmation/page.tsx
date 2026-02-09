// app/order-confirmation/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderConfirmation {
  orderId: string;
  date: string;
  item: {
    productId: number;
    productName: string;
    productImage: string;
    category: string;
    customOptions: Record<string, unknown>;
  };
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  specialInstructions?: string;
}

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<OrderConfirmation | null>(
    null,
  );

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("orderConfirmation");
    if (savedOrder) {
      try {
        setOrderDetails(JSON.parse(savedOrder));
        // Clear the confirmation after displaying
        sessionStorage.removeItem("orderConfirmation");
      } catch (error) {
        console.error("Failed to parse order confirmation:", error);
      }
    }
  }, []);

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

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your order has been received. Our team will contact you shortly.
          </p>
          <Link
            href="/all-products"
            className="btn-pana inline-flex items-center py-3 px-6"
          >
            Continue Browsing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Thank you for your order. Our team will review your request and
            contact you shortly.
          </p>
          <p className="text-sm text-muted-foreground">
            Order ID:{" "}
            <span className="font-mono font-semibold">
              {orderDetails.orderId}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-card rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Order Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Under Review</p>
                    <p className="text-sm text-muted-foreground">
                      Our team is reviewing your specifications
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Quote Provided
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll send you a detailed quote via email
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Production & Delivery
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Once confirmed, we&apos;ll start production
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Order Details
              </h2>

              {/* Product Info */}
              <div className="flex items-start space-x-4 pb-4 border-b border-border">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  <Image
                    src={orderDetails.item.productImage}
                    alt={orderDetails.item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {orderDetails.item.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.item.category}
                  </p>
                </div>
              </div>

              {/* Selected Options */}
              <div className="py-4">
                <h3 className="font-medium text-foreground mb-3">
                  Selected Options
                </h3>
                <div className="space-y-2">
                  {getDisplayOptions(orderDetails.item.customOptions).map(
                    (option, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
                      >
                        <span className="text-muted-foreground">
                          {option.label}
                        </span>
                        <span className="text-foreground font-medium">
                          {option.value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              {orderDetails.specialInstructions && (
                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground mb-2">
                    Special Instructions
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    {orderDetails.specialInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Contact & Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground font-medium">
                    {orderDetails.contact.firstName}{" "}
                    {orderDetails.contact.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {orderDetails.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {orderDetails.contact.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Delivery Address
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-foreground">
                        {orderDetails.delivery.address}
                      </p>
                      <p className="text-muted-foreground">
                        {orderDetails.delivery.city}
                        {orderDetails.delivery.state &&
                          `, ${orderDetails.delivery.state}`}
                        , {orderDetails.delivery.postalCode}
                      </p>
                      <p className="text-muted-foreground">
                        {orderDetails.delivery.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-card rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+251116686940"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>+251 116 68 69 40</span>
                </a>
                <a
                  href="mailto:panapromotionplc@gmail.com"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </a>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-card rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What&apos;s Next?
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• You&apos;ll receive an email confirmation shortly</p>
                <p>• Our team will review your order specifications</p>
                <p>• We&apos;ll contact you within 24 hours with a quote</p>
                <p>• Once confirmed, production will begin</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/account"
                className="w-full btn-pana py-3 inline-flex items-center justify-center"
              >
                View Order History
              </Link>
              <Link
                href="/all-products"
                className="w-full border border-border rounded-lg py-3 inline-flex items-center justify-center hover:bg-secondary transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

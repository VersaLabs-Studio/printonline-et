"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main order flow which has full API integration
    router.replace("/order-summary");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

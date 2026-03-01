"use client";

import React from "react";
import { ProductWithDetails } from "@/types";
import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductOrderForm } from "./ProductOrderForm";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";
import { motion } from "framer-motion";

interface ProductDetailPageProps {
  product: ProductWithDetails;
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <ProductBreadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-16">
          {/* Left Column: Visuals */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <ProductGallery product={product} />
          </motion.section>

          {/* Right Column: Interaction */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <ProductInfo product={product} />
            <ProductOrderForm product={product} />
          </motion.section>
        </div>

        {/* Full Width Sections */}
        <section className="space-y-16">
          <ProductTabs product={product} />
          <RelatedProducts currentProduct={product} />
        </section>
      </main>
    </div>
  );
}

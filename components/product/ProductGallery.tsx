"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SafeMotionDiv, SafeAnimatePresence } from "@/components/shared/SafeMotion";
import { ProductWithDetails } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductGalleryProps {
  product: ProductWithDetails;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.product_images || [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-center">
        <span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">
          No Asset Bound
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SafeMotionDiv
        layoutId={`product-image-${product.id}`}
        className="relative aspect-square w-full rounded-2xl bg-muted/10 border border-border/40 overflow-hidden shadow-sm group"
      >
        <SafeAnimatePresence mode="wait">
          <SafeMotionDiv
            key={selectedIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[selectedIdx].image_url}
              alt={images[selectedIdx].alt_text || product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            </SafeMotionDiv>
        </SafeAnimatePresence>

        {product.badge && (
          <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-xs h-7 px-4 shadow-xl border-none">
            {product.badge}
          </Badge>
        )}
        </SafeMotionDiv>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 active:scale-95",
                selectedIdx === idx
                  ? "border-primary shadow-lg shadow-primary/20 scale-105"
                  : "border-border/40 hover:border-primary/40 grayscale group-hover:grayscale-0",
              )}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

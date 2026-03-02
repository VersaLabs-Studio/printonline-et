"use client";

import React from "react";
import { ProductWithDetails } from "@/types";
import { useProducts } from "@/hooks/data/useProducts";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface RelatedProductsProps {
  currentProduct: ProductWithDetails;
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const { data: products, isLoading } = useProducts({
    categorySlug: currentProduct.category?.slug || undefined,
    limit: 5,
  });

  // Filter out current product
  const related =
    products?.filter((p) => p.id !== currentProduct.id).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="space-y-8 py-12">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-4/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="space-y-10 py-12 border-t border-border/40">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Explore More
          </h3>
          <h2 className="text-3xl font-semibold tracking-tight">
            You might also like
          </h2>
        </div>
        <Link
          href="/all-products"
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:text-primary transition-colors pb-1"
        >
          View Full Catalog
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-1">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

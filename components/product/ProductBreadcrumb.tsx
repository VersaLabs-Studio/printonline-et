"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ProductWithDetails } from "@/types";

interface ProductBreadcrumbProps {
  product: ProductWithDetails;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-6 px-1 overflow-hidden whitespace-nowrap">
      <Link
        href="/"
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <Home size={12} />
        HOME
      </Link>
      <ChevronRight size={10} className="opacity-40" />
      <Link
        href="/all-products"
        className="hover:text-primary transition-colors"
      >
        BROWSE
      </Link>
      {product.category && (
        <>
          <ChevronRight size={10} className="opacity-40" />
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-primary transition-colors truncate"
          >
            {product.category.name}
          </Link>
        </>
      )}
      <ChevronRight size={10} className="opacity-40" />
      <span className="text-foreground/80 font-semibold truncate">
        {product.name}
      </span>
    </nav>
  );
}

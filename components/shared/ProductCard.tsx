"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithCategory } from "@/types";
import { PriceDisplay } from "./PriceDisplay";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full bg-card rounded-4xl border border-border/40 overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5"
    >
      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 z-30"
      />

      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-muted/20">
        <Image
          src={
            product.product_images?.[0]?.image_url ||
            "/images/placeholder-product.jpg"
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Out of Stock Overlay */}
        {product.stock_status === "out_of_stock" && (
          <div className="absolute inset-0 bg-destructive/40 z-20 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-black uppercase tracking-[0.25em] text-[10px] shadow-2xl border-2 border-white/20 scale-110 -rotate-3">
              Out of Stock
            </div>
          </div>
        )}

        {/* Overlay on hover (only if in stock) */}
        {product.stock_status !== "out_of_stock" && (
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-background/90 flex items-center justify-center text-primary shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
              <ArrowUpRight size={24} />
            </div>
          </div>
        )}

        {product.stock_status !== "out_of_stock" && product.badge && (
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-[9px] h-6 px-3 shadow-lg border-none">
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] truncate">
            {product.category?.name || "Global Collection"}
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
        </div>

        <h3 className="text-lg font-bold tracking-tighter text-foreground line-clamp-2 leading-tight flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-bold text-primary tracking-tighter">
            <PriceDisplay amount={product.base_price} />
          </div>
          <button
            disabled={product.stock_status === "out_of_stock"}
            className={cn(
              "relative z-40 h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm",
              product.stock_status === "out_of_stock"
                ? "bg-muted text-muted-foreground/30 border border-border/20 cursor-not-allowed"
                : "bg-muted/40 border border-border/40 text-muted-foreground hover:bg-primary hover:text-white hover:border-primary",
            )}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

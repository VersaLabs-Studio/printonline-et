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
        className="absolute inset-0 z-10"
      />

      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-muted/20">
        <Image
          src={
            (product as any).product_images?.[0]?.image_url ||
            "/images/placeholder-product.jpg"
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-background/90 flex items-center justify-center text-primary shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
            <ArrowUpRight size={24} />
          </div>
        </div>

        {product.stock_status === "out_of_stock" ? (
          <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground font-bold uppercase tracking-[0.2em] text-[8px] h-6 px-3 shadow-lg border-none animate-pulse">
            Out of Stock
          </Badge>
        ) : (
          product.badge && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-[9px] h-6 px-3 shadow-lg border-none">
              {product.badge}
            </Badge>
          )
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
              "h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm",
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

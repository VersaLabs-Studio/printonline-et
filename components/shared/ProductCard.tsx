"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithCategory } from "@/types";
import { PriceDisplay } from "./PriceDisplay";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full bg-card rounded-[2rem] border border-border/40 overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5"
    >
      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 z-10"
      />

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
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

        {product.badge && (
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[9px] h-6 px-3 shadow-lg border-none">
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] truncate">
            {product.category?.name || "Global Collection"}
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
        </div>

        <h3 className="text-lg font-black tracking-tighter text-foreground line-clamp-2 leading-tight flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-black text-primary tracking-tighter">
            <PriceDisplay amount={product.base_price} />
          </div>
          <button className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

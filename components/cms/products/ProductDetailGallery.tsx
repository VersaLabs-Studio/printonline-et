"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductWithCategory } from "@/types";
import { cn } from "@/lib/utils";

interface ProductDetailGalleryProps {
  product: ProductWithCategory;
}

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl p-6 bg-muted/5">
      <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
        <ImageIcon size={14} className="text-primary" /> Visual Assets
      </h5>
      <div className="grid grid-cols-2 gap-4">
        {product.product_images && product.product_images.length > 0
          ? product.product_images.map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-2xl bg-muted border border-border/40 overflow-hidden group relative transition-all duration-500 hover:border-primary/50 hover:shadow-lg shadow-black/5"
              >
                <img
                  src={img.image_url}
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {img.is_primary && (
                  <Badge className="absolute top-2.5 left-2.5 text-[8px] bg-primary h-4.5 px-2 rounded hover:bg-primary shadow-lg border-none uppercase font-bold tracking-widest z-10">
                    Primary
                  </Badge>
                )}

                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20">
                  <button className="h-7 w-7 rounded-xl bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          : null}

        <button className="aspect-square rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all group shadow-sm">
          <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
            <Plus
              size={24}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Add Image
          </span>
          <span className="text-[8px] text-muted-foreground/60 mt-1 uppercase tracking-tighter">
            PNG, JPG up to 10MB
          </span>
        </button>
      </div>
    </Card>
  );
}

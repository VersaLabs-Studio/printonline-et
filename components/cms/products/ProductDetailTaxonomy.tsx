"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Layers, Settings, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductWithDetails } from "@/types";

interface ProductDetailTaxonomyProps {
  product: ProductWithDetails;
}

export function ProductDetailTaxonomy({ product }: ProductDetailTaxonomyProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm rounded-2xl p-6 bg-muted/5">
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Layers size={14} className="text-primary" /> Taxonomy & SEO
        </h5>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-border" /> Catalog
              Category
            </p>
            <Badge
              variant="outline"
              className="border-primary/30 text-primary uppercase text-[10px] font-bold tracking-widest bg-primary/5 rounded-xl px-3 py-1 shadow-sm"
            >
              {product.category?.name || "Global / Uncategorized"}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-border" /> Storefront
              Route
            </p>
            <div className="group relative">
              <code className="text-[11px] bg-muted shadow-inner p-3 block rounded-xl font-mono font-bold tracking-tight text-foreground/70 break-all border border-border/30 group-hover:bg-muted/80 transition-colors">
                /products/{product.slug}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 absolute right-2 top-1/2 -translate-y-1/2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://printonline.et/products/${product.slug}`,
                  )
                }
              >
                <Globe size={12} className="text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
          <Settings size={14} /> Critical Actions
        </div>
        <p className="text-[11px] text-primary/70 leading-relaxed font-bold italic">
          This product is currently <b>LIVE</b> and visible to the public.
          Changes reflect instantly on the storefront.
        </p>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full rounded-xl bg-background hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all h-10 border-border/40"
          >
            Switch to Draft
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl bg-background hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all h-10 border-border/40"
          >
            Archive Product
          </Button>
        </div>
      </div>
    </div>
  );
}

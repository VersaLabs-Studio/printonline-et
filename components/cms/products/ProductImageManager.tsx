"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  GripVertical,
  CloudUpload,
} from "lucide-react";
import { ProductWithCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductImageManagerProps {
  product: ProductWithCategory;
}

export function ProductImageManager({ product }: ProductImageManagerProps) {
  return (
    <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black uppercase tracking-[0.1em] flex items-center gap-2">
          <ImageIcon size={16} className="text-primary" /> Visual Assets
        </CardTitle>
        <Button
          size="sm"
          className="h-9 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-4 shadow-lg shadow-primary/20"
        >
          <CloudUpload size={14} /> Batch Upload
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {product.product_images?.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-2xl bg-muted border border-border/40 overflow-hidden shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-500"
            >
              <img
                src={img.image_url}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {img.is_primary && (
                <Badge className="absolute top-2 left-2 text-[8px] bg-primary h-4.5 px-2 rounded-lg border-none uppercase font-black tracking-widest z-10 shadow-lg">
                  Primary
                </Badge>
              )}

              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                {!img.is_primary && (
                  <button
                    className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors focus:scale-95"
                    title="Set as Primary"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
                <button
                  className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-destructive transition-colors focus:scale-95"
                  title="Delete Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="absolute top-2 right-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-lg p-1 text-white/50 hover:text-white">
                <GripVertical size={14} />
              </div>
            </div>
          ))}

          <button className="aspect-square rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all group shadow-inner">
            <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <Plus
                size={28}
                className="group-hover:scale-125 transition-transform"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Add Media
            </span>
            <span className="text-[8px] font-bold mt-1 opacity-50 uppercase tracking-tighter">
              MAX 10MB
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

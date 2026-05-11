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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean | null;
  display_order: number | null;
}

interface ProductImageManagerProps {
  productId: string;
  images: ProductImage[];
}

export function ProductImageManager({ productId, images }: ProductImageManagerProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const newImages: { url: string; alt_text: string }[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `products/${productId}`);

        const res = await fetch("/api/upload/site-images", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const json = await res.json();
          toast.error(json.error || "Upload failed");
          continue;
        }

        const json = await res.json();
        newImages.push({
          url: json.url,
          alt_text: file.name.replace(/\.[^.]+$/, ""),
        });
      } catch {
        toast.error("Upload failed");
      }
    }

    if (newImages.length > 0) {
      try {
        const res = await fetch(`/api/cms/products/${productId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: [
              ...images.map((img) => ({
                url: img.image_url,
                alt_text: img.alt_text,
                display_order: img.display_order ?? 0,
                is_primary: img.is_primary ?? false,
              })),
              ...newImages.map((img, idx) => ({
                url: img.url,
                alt_text: img.alt_text,
                display_order: images.length + idx,
                is_primary: images.length === 0 && idx === 0,
              })),
            ],
          }),
        });

        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.success(`${newImages.length} image(s) uploaded`);
        } else {
          toast.error("Failed to save image records");
        }
      } catch {
        toast.error("Failed to save image records");
      }
    }
    setUploading(false);
  };

  const handleDelete = async (imageId: string) => {
    try {
      const res = await fetch(
        `/api/cms/products/${productId}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Image removed");
      }
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const updatedImages = images.map((img) => ({
        url: img.image_url,
        alt_text: img.alt_text,
        display_order: img.display_order ?? 0,
        is_primary: img.id === imageId,
      }));

      const res = await fetch(`/api/cms/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: updatedImages }),
      });

      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Primary image updated");
      }
    } catch {
      toast.error("Failed to update primary image");
    }
  };

  return (
    <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
          <ImageIcon size={16} className="text-primary" /> Visual Assets
        </CardTitle>
        <Button
          size="sm"
          className="h-9 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 px-4 shadow-lg shadow-primary/20"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <CloudUpload size={14} /> {uploading ? "Uploading..." : "Batch Upload"}
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-2xl bg-muted border border-border/40 overflow-hidden shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-500"
            >
              <img
                src={img.image_url}
                alt={img.alt_text || "Product image"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {img.is_primary && (
                <Badge className="absolute top-2 left-2 text-[8px] bg-primary h-4.5 px-2 rounded-md border-none uppercase font-bold tracking-widest z-10 shadow-lg">
                  Primary
                </Badge>
              )}

              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors focus:scale-95"
                    title="Set as Primary"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
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

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "aspect-square rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground transition-all group shadow-inner",
              uploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/5 hover:border-primary/40 hover:text-primary cursor-pointer"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              {uploading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Plus
                  size={28}
                  className="group-hover:scale-125 transition-transform"
                />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {uploading ? "Uploading..." : "Add Media"}
            </span>
            <span className="text-[8px] font-bold mt-1 opacity-50 uppercase tracking-tighter">
              MAX 10MB
            </span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </CardContent>
    </Card>
  );
}

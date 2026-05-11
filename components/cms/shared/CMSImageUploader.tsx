"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, Trash2, GripVertical, CheckCircle2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  alt_text?: string | null;
  display_order?: number;
  is_primary?: boolean;
  id?: string;
}

interface CMSImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  folder: string;
  maxImages?: number;
}

export function CMSImageUploader({
  images,
  onImagesChange,
  folder,
  maxImages = 10,
}: CMSImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

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
          display_order: images.length + newImages.length,
          is_primary: images.length === 0 && newImages.length === 0,
        });
      } catch {
        toast.error("Upload failed");
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded`);
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true;
    }
    onImagesChange(updated);
  };

  const setPrimary = (index: number) => {
    onImagesChange(
      images.map((img, i) => ({ ...img, is_primary: i === index }))
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            className="group relative aspect-square rounded-xl bg-muted border border-border/40 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
          >
            <img
              src={img.url}
              alt={img.alt_text || `Image ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {img.is_primary && (
              <Badge className="absolute top-2 left-2 text-[8px] bg-primary h-5 px-2 rounded-md border-none uppercase font-bold tracking-widest z-10 shadow-lg">
                Primary
              </Badge>
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              {!img.is_primary && (
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors"
                  title="Set as Primary"
                >
                  <CheckCircle2 size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-destructive transition-colors"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="absolute top-2 right-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-md p-1 text-white/50 hover:text-white">
              <GripVertical size={12} />
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground transition-all group shadow-inner",
              uploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/5 hover:border-primary/40 hover:text-primary cursor-pointer"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
              {uploading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <CloudUpload
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest">
              {uploading ? "Uploading..." : "Upload"}
            </span>
            <span className="text-[7px] font-bold mt-0.5 opacity-50 uppercase">
              MAX 10MB
            </span>
          </button>
        )}
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
    </div>
  );
}

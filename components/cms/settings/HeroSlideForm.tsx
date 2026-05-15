"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  heroSlideSchema,
  type HeroSlideFormData,
} from "@/lib/validations/cms";
import {
  useCreateHeroSlide,
  useUpdateHeroSlide,
} from "@/hooks/data/useHeroSlides";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface HeroSlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    subtitle?: string;
    image_url: string;
    cta_text?: string;
    cta_link?: string;
    display_order: number;
    is_active: boolean;
  } | null;
}

export function HeroSlideForm({
  isOpen,
  onClose,
  initialData,
}: HeroSlideFormProps) {
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const isEditing = !!initialData;

  const form = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      image_url: initialData?.image_url || "",
      cta_text: initialData?.cta_text || "Order Now",
      cta_link: initialData?.cta_link || "/all-products",
      display_order: initialData?.display_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        image_url: initialData?.image_url || "",
        cta_text: initialData?.cta_text || "Order Now",
        cta_link: initialData?.cta_link || "/all-products",
        display_order: initialData?.display_order || 0,
        is_active: initialData?.is_active ?? true,
      });
    }
  }, [isOpen, initialData, form]);

  const imageUrl = form.watch("image_url");
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");

      const res = await fetch("/api/upload/site-images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error || "Upload failed");
        return;
      }

      const json = await res.json();
      form.setValue("image_url", json.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: HeroSlideFormData) => {
    if (isEditing && initialData) {
      updateSlide.mutate(
        { id: initialData.id, ...values },
        { onSuccess: onClose }
      );
    } else {
      createSlide.mutate(values, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Hero Slide" : "New Hero Slide"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Premium Printing Services"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Subtitle
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. High quality prints in Addis"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight">
                    Image URL
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        className="rounded-xl flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl h-10 gap-2 shrink-0"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      {uploading ? "..." : "Upload"}
                    </Button>
                  </div>
                  {imageUrl && (
                    <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-border/40 bg-muted/30">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                          (e.target as HTMLImageElement).classList.add("hidden");
                        }}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cta_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      CTA Text
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Order Now"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cta_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      CTA Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/all-products"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Display Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="rounded-xl"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-6">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight cursor-pointer">
                      Active
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-10 font-bold uppercase tracking-widest text-[10px] px-6"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl h-10 font-bold uppercase tracking-widest text-[10px] px-6 gap-2"
                disabled={createSlide.isPending || updateSlide.isPending}
              >
                <Save size={14} />
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

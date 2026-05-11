"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, X, Package, Layers, Info, Zap, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCategories } from "@/hooks/data/useCategories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/data/useProducts";
import { CMSImageUploader, type UploadedImage } from "@/components/cms/shared/CMSImageUploader";
import type { ProductWithCategory } from "@/types";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  category_id: z.string().uuid("Please select a category"),
  base_price: z.coerce.number().min(0, "Price must be positive"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  overview: z.string().optional(),
  features: z.string().optional(),
  specifications: z.string().optional(),
  sku: z.string().optional(),
  stock_status: z.enum([
    "in_stock",
    "low_stock",
    "out_of_stock",
    "made_to_order",
  ]),
  form_type: z.string().default("paper"),
  min_order_quantity: z.coerce.number().min(1).default(1),
  rush_eligible: z.boolean().default(true),
  badge: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductWithCategory> & {
    features?: string[] | string | null;
    specifications?: Record<string, string> | string | null;
  };
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const featuresValue = React.useMemo(() => {
    if (!initialData?.features) return "";
    if (Array.isArray(initialData.features)) return initialData.features.join("\n");
    if (typeof initialData.features === "string") return initialData.features;
    return "";
  }, [initialData?.features]);

  const specsValue = React.useMemo(() => {
    if (!initialData?.specifications) return "";
    if (typeof initialData.specifications === "object") {
      return Object.entries(initialData.specifications)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    }
    return String(initialData.specifications);
  }, [initialData?.specifications]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      category_id: initialData?.category_id || "",
      base_price: initialData?.base_price || 0,
      short_description: initialData?.short_description || "",
      description: initialData?.description || "",
      overview: initialData?.overview || "",
      features: featuresValue,
      specifications: specsValue,
      sku: initialData?.sku || "",
      stock_status: (initialData?.stock_status as "in_stock" | "low_stock" | "out_of_stock" | "made_to_order") || "in_stock",
      form_type: initialData?.form_type || "paper",
      min_order_quantity: initialData?.min_order_quantity || 50,
      rush_eligible: initialData?.rush_eligible ?? true,
      badge: initialData?.badge || "",
    },
  });

  const [images, setImages] = React.useState<UploadedImage[]>([]);

  React.useEffect(() => {
    if (isEditing && initialData?.id) {
      fetch(`/api/cms/products/${initialData.id}/images`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data?.length) {
            setImages(
              json.data.map((img: { id: string; image_url: string; alt_text: string | null; display_order: number | null; is_primary: boolean | null }) => ({
                id: img.id,
                url: img.image_url,
                alt_text: img.alt_text,
                display_order: img.display_order ?? 0,
                is_primary: img.is_primary ?? false,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [isEditing, initialData?.id]);

  const watchedName = form.watch("name");

  React.useEffect(() => {
    if (!isEditing && watchedName) {
      const autoSlug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", autoSlug, { shouldValidate: false });

      const sku = "POL-" + watchedName
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "")
        .split(/\s+/)
        .map((w: string) => w.slice(0, 4))
        .filter(Boolean)
        .join("-");
      form.setValue("sku", sku, { shouldValidate: false });
    }
  }, [watchedName, isEditing, form]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const features = values.features
        ? values.features.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];

      let specs: Record<string, string> | null = null;
      if (values.specifications) {
        specs = {};
        for (const line of values.specifications.split("\n")) {
          const idx = line.indexOf(":");
          if (idx > 0) {
            const key = line.slice(0, idx).trim();
            const val = line.slice(idx + 1).trim();
            if (key && val) specs[key] = val;
          }
        }
        if (Object.keys(specs).length === 0) specs = null;
      }

      const payload = {
        name: values.name,
        slug: values.slug,
        category_id: values.category_id,
        base_price: values.base_price,
        short_description: values.short_description || null,
        description: values.description || null,
        overview: values.overview || null,
        features: features.length > 0 ? features : null,
        specifications: specs,
        sku: values.sku || null,
        stock_status: values.stock_status,
        form_type: values.form_type,
        min_order_quantity: values.min_order_quantity,
        rush_eligible: values.rush_eligible,
        badge: values.badge || null,
        is_active: true,
      };

      let productId = initialData?.id;

      if (isEditing && productId) {
        await updateProduct.mutateAsync({ ...payload, id: productId });
      } else {
        const result = await createProduct.mutateAsync(payload);
        productId = result?.product?.id;
      }

      if (productId && images.length > 0) {
        await fetch(`/api/cms/products/${productId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images }),
        });
      }

      toast.success(
        isEditing
          ? "Product updated successfully"
          : "Product created successfully",
      );
      router.push("/cms/products");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred. Please try again.";
      toast.error(message);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Package size={14} /> Global Identifiers
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-tight">
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Premium Business Cards"
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-tight">
                          URL Slug
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="premium-business-cards"
                            className="rounded-xl font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[10px] text-muted-foreground">
                          Auto-generated from name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Tagline / Short Intro
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="High-quality 300gsm paper with matte finish."
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Full Product Details
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the product features, paper quality, etc."
                          className="rounded-xl min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight flex items-center gap-1.5">
                        <Zap size={12} className="text-primary" />
                        Product Overview
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed product overview for the Overview tab..."
                          className="rounded-xl min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Layers size={14} /> Features & Specifications
                </div>
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Key Features (one per line)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={"Premium Cardstock\nMatte & Glossy Lamination\nRounded or Sharp Corners\nBoth Side Printing\nQuick Turnaround"}
                          className="rounded-xl min-h-[120px] resize-none font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] text-muted-foreground">
                        Each line becomes a bullet point on the storefront.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Specifications (key: value, one per line)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={"Paper Weight: 300gsm\nSize: 90mm x 55mm\nFinish: Matte Lamination\nPrinting: Full Color Both Sides"}
                          className="rounded-xl min-h-[120px] resize-none font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] text-muted-foreground">
                        Format: &quot;Key: Value&quot; — one entry per line.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <ImageIcon size={14} /> Product Images
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Upload images for this product. The primary image is used as the main display.
                </p>
                <CMSImageUploader
                  images={images}
                  onImagesChange={setImages}
                  folder={`products/${initialData?.id || "new"}`}
                  maxImages={10}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-border/40 shadow-sm bg-muted/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Layers size={14} /> Catalog
                </div>
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {categories?.map((cat) => (
                            <SelectItem
                              key={cat.id}
                              value={cat.id}
                              className="rounded-lg"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Inventory SKU
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="POL-BUS-CARD"
                          className="rounded-xl font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] text-muted-foreground">
                        Auto-generated from name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="form_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Form Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select form type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="paper">Paper</SelectItem>
                          <SelectItem value="large-format">Large Format</SelectItem>
                          <SelectItem value="apparel">Apparel</SelectItem>
                          <SelectItem value="gift">Gift</SelectItem>
                          <SelectItem value="board">Board</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 shadow-sm bg-muted/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Info size={14} /> Pricing & Stock
                </div>
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Base Price (ETB)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">
                            ETB
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            className="rounded-xl pl-12 font-bold text-primary"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Inventory Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Stock status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="low_stock">Low Stock</SelectItem>
                          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          <SelectItem value="made_to_order">Made to Order</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="min_order_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Min Order Qty
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="rush_eligible"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs font-bold uppercase tracking-tight cursor-pointer">
                          Rush Production
                        </FormLabel>
                        <FormDescription className="text-[10px]">
                          Allow expedited production.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Badge
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Best Seller, New, Popular"
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-xs gap-2"
              >
                <Save size={18} />
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-border/50 font-bold text-xs uppercase tracking-widest gap-2"
                onClick={() => router.back()}
              >
                <X size={18} />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

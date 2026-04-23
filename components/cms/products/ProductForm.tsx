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
import { Save, X, Package, Layers, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCategories } from "@/hooks/data/useCategories";
import { ProductWithCategory } from "@/types";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  category_id: z.string().uuid("Please select a category"),
  base_price: z.coerce.number().min(0, "Price must be positive"),
  hire_designer_fee: z.coerce.number().min(0, "Fee must be positive").default(0),
  short_description: z.string().optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  stock_status: z.enum([
    "in_stock",
    "low_stock",
    "out_of_stock",
    "made_to_order",
  ]),
  form_type: z.string().default("paper"),
  min_order_quantity: z.coerce.number().min(1).default(1),
  badge: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductWithCategory>;
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      category_id: initialData?.category_id || "",
      base_price: initialData?.base_price || 0,
      hire_designer_fee: (initialData as any)?.hire_designer_fee || 0,
      short_description: initialData?.short_description || "",
      description: initialData?.description || "",
      sku: initialData?.sku || "",
      stock_status: (initialData?.stock_status as any) || "in_stock",
      form_type: initialData?.form_type || "paper",
      min_order_quantity: initialData?.min_order_quantity || 50,
      badge: initialData?.badge || "",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const url = "/api/cms/products";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing 
        ? { ...values, id: initialData?.id }
        : values;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details?.[0]?.message || "Failed to save product");
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
                          className="rounded-xl min-h-[150px] resize-none"
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
                  <Layers size={14} /> Catalog Taxonomy & Logic
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="POL-BUS-PREM"
                            className="rounded-xl font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                  name="hire_designer_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-tight">
                        Hire Designer Fee (ETB)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">
                            ETB
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            className="rounded-xl pl-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-[10px]">
                        Fee for &quot;Hire a Designer&quot; service (0 = disabled)
                      </FormDescription>
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
                          <SelectItem value="in_stock" className="rounded-lg">
                            In Stock
                          </SelectItem>
                          <SelectItem value="low_stock" className="rounded-lg">
                            Low Stock
                          </SelectItem>
                          <SelectItem
                            value="out_of_stock"
                            className="rounded-lg"
                          >
                            Out of Stock
                          </SelectItem>
                          <SelectItem
                            value="made_to_order"
                            className="rounded-lg"
                          >
                            Made to Order
                          </SelectItem>
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
                        Minimal Order Qty
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
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-xs gap-2"
              >
                <Save size={18} />
                {isEditing ? "Save Changes" : "Create Product"}
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

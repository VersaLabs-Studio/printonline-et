"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X, Layers, Search, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  categoryFormSchema,
  type CategoryFormData,
} from "@/lib/validations/cms";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/data/useCategories";
import type { Category } from "@/types/database";

interface CategoryFormProps {
  initialData?: Partial<Category>;
  isEditing?: boolean;
}

export function CategoryForm({
  initialData,
  isEditing = false,
}: CategoryFormProps) {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      imageUrl: initialData?.image_url || "",
      displayOrder: initialData?.display_order ?? 0,
      isActive: initialData?.is_active ?? true,
      metaTitle: initialData?.meta_title || "",
      metaDescription: initialData?.meta_description || "",
    },
  });

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
    }
  }, [watchedName, isEditing, form]);

  const onSubmit = async (values: CategoryFormData) => {
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        image_url: values.imageUrl || null,
        display_order: values.displayOrder,
        is_active: values.isActive,
        meta_title: values.metaTitle || null,
        meta_description: values.metaDescription || null,
      };

      if (isEditing && initialData?.id) {
        await updateCategory.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createCategory.mutateAsync(payload);
      }

      toast.success(
        isEditing
          ? "Category updated successfully"
          : "Category created successfully",
      );
      router.push("/cms/categories");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    }
  };

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Layers size={14} /> Category Details
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                        Category Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Digital Paper Prints"
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
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                        URL Slug
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="digital-paper-prints"
                          className="rounded-xl font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] text-muted-foreground">
                        Auto-generated from name. Edit if needed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this category..."
                          className="rounded-xl min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
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

            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Globe size={14} /> SEO Metadata
                </div>

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                        Meta Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO title (max 70 chars)"
                          className="rounded-xl"
                          maxLength={70}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] text-muted-foreground">
                        {field.value?.length || 0}/70 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                        Meta Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description (max 160 chars)"
                          className="rounded-xl min-h-[80px] resize-none"
                          maxLength={160}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] text-muted-foreground">
                        {field.value?.length || 0}/160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-border/40 shadow-sm bg-muted/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Search size={14} /> Settings
                </div>

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
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
                      <FormDescription className="text-[10px] text-muted-foreground">
                        Lower numbers appear first.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/40 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-[10px]">
                          Active
                        </FormLabel>
                        <FormDescription className="text-[10px]">
                          Show this category on the storefront.
                        </FormDescription>
                      </div>
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
                    : "Create Category"}
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

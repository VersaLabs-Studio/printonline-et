"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productOptionSchema,
  type ProductOptionFormData,
} from "@/lib/validations/cms";
import { useCreateOption, useUpdateOption } from "@/hooks/data/useProductOptions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import type { ProductOption } from "@/types/database";

interface OptionFormProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductOption | null;
}

export function OptionForm({
  productId,
  isOpen,
  onClose,
  initialData,
}: OptionFormProps) {
  const createOption = useCreateOption();
  const updateOption = useUpdateOption();
  const isEditing = !!initialData;

  const form = useForm<ProductOptionFormData>({
    resolver: zodResolver(productOptionSchema),
    defaultValues: {
      optionKey: initialData?.option_key || "",
      optionLabel: initialData?.option_label || "",
      fieldType: (initialData?.field_type as ProductOptionFormData["fieldType"]) || "radio",
      isRequired: initialData?.is_required ?? true,
      displayOrder: initialData?.display_order || 0,
      description: initialData?.description || "",
      groupLabel: initialData?.group_label || "",
      dependsOnOption: initialData?.depends_on_option || "",
      dependsOnValue: initialData?.depends_on_value || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        optionKey: initialData?.option_key || "",
        optionLabel: initialData?.option_label || "",
        fieldType: (initialData?.field_type as ProductOptionFormData["fieldType"]) || "radio",
        isRequired: initialData?.is_required ?? true,
        displayOrder: initialData?.display_order || 0,
        description: initialData?.description || "",
        groupLabel: initialData?.group_label || "",
        dependsOnOption: initialData?.depends_on_option || "",
        dependsOnValue: initialData?.depends_on_value || "",
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: ProductOptionFormData) => {
    const payload = {
      option_key: values.optionKey,
      option_label: values.optionLabel,
      field_type: values.fieldType,
      is_required: values.isRequired,
      display_order: values.displayOrder,
      description: values.description || null,
      group_label: values.groupLabel || null,
      depends_on_option: values.dependsOnOption || null,
      depends_on_value: values.dependsOnValue || null,
    };

    if (isEditing && initialData) {
      updateOption.mutate(
        { productId, optionId: initialData.id, ...payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createOption.mutate(
        { productId, ...payload },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Option Group" : "New Option Group"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="optionLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Label
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Paper Quality"
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
                name="optionKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Key
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. paper_quality"
                        className="rounded-xl font-mono"
                        disabled={isEditing}
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
                name="fieldType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Field Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="radio">Radio Buttons</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="multi-select">
                          Multi-Select
                        </SelectItem>
                        <SelectItem value="modal-link">Modal Link</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayOrder"
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
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optional description"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                disabled={createOption.isPending || updateOption.isPending}
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

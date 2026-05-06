"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productOptionValueSchema,
  type ProductOptionValueFormData,
} from "@/lib/validations/cms";
import {
  useCreateOptionValue,
  useUpdateOptionValue,
} from "@/hooks/data/useProductOptions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import type { ProductOptionValue } from "@/types/database";

interface OptionValueFormProps {
  productId: string;
  optionId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductOptionValue | null;
}

export function OptionValueForm({
  productId,
  optionId,
  isOpen,
  onClose,
  initialData,
}: OptionValueFormProps) {
  const createValue = useCreateOptionValue();
  const updateValue = useUpdateOptionValue();
  const isEditing = !!initialData;

  const form = useForm<ProductOptionValueFormData>({
    resolver: zodResolver(productOptionValueSchema),
    defaultValues: {
      value: initialData?.value || "",
      label: initialData?.label || "",
      priceAmount: initialData?.price_amount || 0,
      priceType: (initialData?.price_type as ProductOptionValueFormData["priceType"]) || "fixed",
      groupName: initialData?.group_name || "",
      description: initialData?.description || "",
      displayOrder: initialData?.display_order || 0,
      isDefault: initialData?.is_default ?? false,
      isActive: initialData?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        value: initialData?.value || "",
        label: initialData?.label || "",
        priceAmount: initialData?.price_amount || 0,
        priceType: (initialData?.price_type as ProductOptionValueFormData["priceType"]) || "fixed",
        groupName: initialData?.group_name || "",
        description: initialData?.description || "",
        displayOrder: initialData?.display_order || 0,
        isDefault: initialData?.is_default ?? false,
        isActive: initialData?.is_active ?? true,
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: ProductOptionValueFormData) => {
    const payload = {
      value: values.value,
      label: values.label,
      price_amount: values.priceAmount || null,
      price_type: values.priceType,
      group_name: values.groupName || null,
      description: values.description || null,
      display_order: values.displayOrder,
      is_default: values.isDefault,
      is_active: values.isActive,
    };

    if (isEditing && initialData) {
      updateValue.mutate(
        { productId, optionId, valueId: initialData.id, ...payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createValue.mutate(
        { productId, optionId, ...payload },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Option Value" : "New Option Value"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Display Label
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Matte Finish"
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
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Value Key
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. matte"
                        className="rounded-xl font-mono"
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
                name="priceAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Price Amount (ETB)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="rounded-xl"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Price Type
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
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="multiplier">Multiplier</SelectItem>
                        <SelectItem value="override">Override</SelectItem>
                      </SelectContent>
                    </Select>
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
            <div className="flex items-center gap-6">
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight cursor-pointer">
                      Default
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
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
                disabled={createValue.isPending || updateValue.isPending}
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

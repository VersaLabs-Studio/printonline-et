"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deliveryZoneSchema,
  type DeliveryZoneFormData,
} from "@/lib/validations/cms";
import {
  useCreateDeliveryZone,
  useUpdateDeliveryZone,
} from "@/hooks/data/useDeliveryZones";
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
import { Save } from "lucide-react";
import type { DeliveryZoneWithTiers } from "@/hooks/data/useDeliveryZones";

interface DeliveryZoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DeliveryZoneWithTiers | null;
}

export function DeliveryZoneForm({
  isOpen,
  onClose,
  initialData,
}: DeliveryZoneFormProps) {
  const createZone = useCreateDeliveryZone();
  const updateZone = useUpdateDeliveryZone();
  const isEditing = !!initialData;

  const form = useForm<DeliveryZoneFormData>({
    resolver: zodResolver(deliveryZoneSchema),
    defaultValues: {
      sub_city: initialData?.sub_city || "",
      base_fee: initialData?.base_fee || 0,
      description: initialData?.description || "",
      zone_label: initialData?.zone_label || "",
      display_order: initialData?.display_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        sub_city: initialData?.sub_city || "",
        base_fee: initialData?.base_fee || 0,
        description: initialData?.description || "",
        zone_label: initialData?.zone_label || "",
        display_order: initialData?.display_order || 0,
        is_active: initialData?.is_active ?? true,
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: DeliveryZoneFormData) => {
    if (isEditing && initialData) {
      updateZone.mutate(
        { id: initialData.id, ...values },
        { onSuccess: onClose }
      );
    } else {
      createZone.mutate(values, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Delivery Zone" : "New Delivery Zone"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sub_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Sub-City
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Bole"
                        className="rounded-xl"
                        disabled={isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="base_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Base Fee (ETB)
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zone_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Zone Label
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Zone 1"
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
                      placeholder="e.g. Standard delivery - HQ area"
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
              name="is_active"
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
                disabled={createZone.isPending || updateZone.isPending}
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

"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileUpdateInput } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUB_CITIES = [
  "Addis Ketema",
  "Akaki Kality",
  "Arada",
  "Bole",
  "Gullele",
  "Kirkos",
  "Kolfe Keranio",
  "Lideta",
  "Nifas Silk-Lafto",
  "Lemi Kura",
  "Yeka",
];

interface ShippingAddressSectionProps {
  register: UseFormRegister<ProfileUpdateInput>;
  control: Control<ProfileUpdateInput>;
  errors: FieldErrors<ProfileUpdateInput>;
}

export function ShippingAddressSection({
  register,
  control,
  errors,
}: ShippingAddressSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <MapPin size={20} />
        <h3 className="font-semibold text-foreground">Shipping Address</h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
          Default
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              placeholder="Bole Road, Around Edna Mall"
              {...register("addressLine1")}
              className={errors.addressLine1 ? "border-red-500" : ""}
            />
            {errors.addressLine1 && (
              <p className="text-[10px] font-bold text-red-500 uppercase">
                {errors.addressLine1.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Building Name, Floor, Office No."
              {...register("addressLine2")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value="Addis Ababa"
              readOnly
              className="bg-muted/50 cursor-not-allowed"
              {...register("city")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCity">Sub-City</Label>
            <Controller
              name="subCity"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger
                    className={errors.subCity ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Sub-City" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUB_CITIES.map((sc) => (
                      <SelectItem key={sc} value={sc}>
                        {sc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subCity && (
              <p className="text-[10px] font-bold text-red-500 uppercase">
                {errors.subCity.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="woreda">Woreda</Label>
            <Input id="woreda" placeholder="03" {...register("woreda")} />
          </div>
        </div>
      </div>
    </div>
  );
}

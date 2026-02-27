"use client";

import { UseFormRegister } from "react-hook-form";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileUpdateInput } from "@/lib/validations";

interface ShippingAddressSectionProps {
  register: UseFormRegister<ProfileUpdateInput>;
}

export function ShippingAddressSection({
  register,
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
            />
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
            <Input id="city" {...register("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCity">Sub-City</Label>
            <Input
              id="subCity"
              placeholder="Bole / Kirkos"
              {...register("subCity")}
            />
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

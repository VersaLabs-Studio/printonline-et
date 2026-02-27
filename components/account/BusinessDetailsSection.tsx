"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Building, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileUpdateInput } from "@/lib/validations";

interface BusinessDetailsSectionProps {
  register: UseFormRegister<ProfileUpdateInput>;
  errors: FieldErrors<ProfileUpdateInput>;
}

export function BusinessDetailsSection({
  register,
  errors,
}: BusinessDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Building size={20} />
        <h3 className="font-semibold text-foreground">Business Details</h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
          Optional
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Pana PLC"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-xs text-destructive">
              {errors.companyName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tinNumber">TIN Number (10 digits)</Label>
          <div className="relative">
            <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="tinNumber"
              className="pl-10"
              placeholder="1234567890"
              {...register("tinNumber")}
            />
          </div>
          {errors.tinNumber && (
            <p className="text-xs text-destructive">
              {errors.tinNumber.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

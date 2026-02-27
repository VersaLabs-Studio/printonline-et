"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User, Globe, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileUpdateInput } from "@/lib/validations";

interface PersonalInfoSectionProps {
  register: UseFormRegister<ProfileUpdateInput>;
  errors: FieldErrors<ProfileUpdateInput>;
  email?: string;
}

export function PersonalInfoSection({
  register,
  errors,
  email,
}: PersonalInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="name" className="pl-10" {...register("name")} />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            className="pl-10 opacity-50 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Email changes require support verification.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            className="pl-10"
            placeholder="0911..."
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>
    </div>
  );
}

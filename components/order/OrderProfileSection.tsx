"use client";

import React from "react";
import {
  User,
  ShieldCheck,
  MapPin,
  Truck,
  Pencil,
  ArrowRight,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface OrderProfileSectionProps {
  profile: Record<string, any> | null;
  session: Record<string, any> | null;
  deliveryMethod: string;
  setDeliveryMethod: (val: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (val: string) => void;
  onNext: () => void;
}

export function OrderProfileSection({
  profile,
  session,
  deliveryMethod,
  setDeliveryMethod,
  specialInstructions,
  setSpecialInstructions,
  onNext,
}: OrderProfileSectionProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 shadow-sm relative overflow-hidden">
      <div className="space-y-1 relative z-10">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Step 1 of 2
        </h3>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight uppercase flex items-center gap-3">
          <ShieldCheck className="text-primary" size={24} /> Account & Delivery
        </h2>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60 flex items-center gap-2">
            <User size={14} /> Contact Details (Synced)
          </h4>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 text-[10px] font-semibold uppercase tracking-widest text-primary hover:bg-primary/5"
          >
            <Link href="/account">
              <Pencil size={12} className="mr-1.5" /> Edit Profile
            </Link>
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-muted/5 border border-border/40 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
              Full Name
            </p>
            <p className="text-sm font-semibold tracking-tight">
              {profile?.full_name || session?.user?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
              Email Address
            </p>
            <p className="text-sm font-semibold tracking-tight">
              {session?.user?.email}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
              Phone Number
            </p>
            <p className="text-sm font-semibold tracking-tight">
              {profile?.phone || "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
              TIN Number
            </p>
            <p className="text-sm font-semibold tracking-tight">
              {profile?.tin_number || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/40 relative z-10">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60 flex items-center gap-2 mb-2">
          <Truck size={14} /> Delivery Preferences
        </h4>

        <RadioGroup
          value={deliveryMethod}
          onValueChange={setDeliveryMethod}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="relative">
            <RadioGroupItem value="home" id="home" className="peer sr-only" />
            <Label
              htmlFor="home"
              className="flex flex-col p-5 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/30 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-2 h-full"
            >
              <div className="flex items-center gap-2 pb-2">
                <Truck className="text-emerald-500" size={18} />
                <span className="font-semibold tracking-tight uppercase">
                  Deliver to my address
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-2">
                {profile?.address_line1
                  ? profile.address_line1
                  : "No address set. Click 'Edit Profile' to add shipping details."}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-60 mt-auto pt-2">
                {profile?.city
                  ? `${profile.city}, ${profile.sub_city || ""}`
                  : ""}
              </p>
            </Label>
          </div>
          <div className="relative">
            <RadioGroupItem
              value="pickup"
              id="pickup"
              className="peer sr-only"
            />
            <Label
              htmlFor="pickup"
              className="flex flex-col p-5 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/30 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-2 h-full"
            >
              <div className="flex items-center gap-2 pb-2">
                <Store className="text-amber-500" size={18} />
                <span className="font-semibold tracking-tight uppercase">
                  Office Pickup
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Pick up from our printing workshop when your order is ready
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-60 mt-auto pt-2">
                Pana Promotion PLC, Addis Ababa, Bole Sub City, Woreda 03,
                Wakero Building, Call +251911005255 for directions
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/40 relative z-10">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          Special Instructions
        </Label>
        <Textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="min-h-[80px] rounded-2xl bg-muted/5 border-border/40 font-medium resize-none p-4"
          placeholder="Any special requirements for production or delivery..."
        />
      </div>

      <div className="pt-2 flex gap-4 relative z-10">
        <Button
          onClick={() => {
            if (deliveryMethod === "home" && !profile?.address_line1) {
              // Optionally block proceeding if home delivery without address
              toast.error(
                "Please add a shipping address in your profile, or select pickup.",
              );
            } else {
              onNext();
            }
          }}
          className="flex-1 btn-pana py-4 text-sm font-semibold uppercase tracking-wider w-full gap-3 active:scale-[0.98]"
        >
          Review Order
          <ArrowRight
            size={18}
            className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>
  );
}

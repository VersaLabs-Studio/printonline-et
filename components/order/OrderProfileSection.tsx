"use client";

import React from "react";
import {
  User,
  Truck,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrderProfileSectionProps {
  step: number;
  contactInfo: any;
  setContactInfo: (data: any) => void;
  deliveryAddress: any;
  setDeliveryAddress: (data: any) => void;
  specialInstructions: string;
  setSpecialInstructions: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OrderProfileSection({
  step,
  contactInfo,
  setContactInfo,
  deliveryAddress,
  setDeliveryAddress,
  specialInstructions,
  setSpecialInstructions,
  onNext,
  onBack,
}: OrderProfileSectionProps) {
  if (step === 1) {
    return (
      <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Step 1 of 3
          </h3>
          <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
            <User className="text-primary" size={28} /> Contact Details
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                First Name
              </Label>
              <Input
                value={contactInfo.firstName}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, firstName: e.target.value })
                }
                className="h-12 rounded-xl bg-muted/5 border-border/40 font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Last Name
              </Label>
              <Input
                value={contactInfo.lastName}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, lastName: e.target.value })
                }
                className="h-12 rounded-xl bg-muted/5 border-border/40 font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
              <Input
                type="email"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                className="h-14 pl-12 rounded-xl bg-muted/5 border-border/40 font-bold text-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
              <Input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
                className="h-14 pl-12 rounded-xl bg-muted/5 border-border/40 font-bold text-lg"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-4 group"
          >
            Continue to Delivery
            <ArrowRight
              size={18}
              className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </form>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Step 2 of 3
          </h3>
          <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Truck className="text-primary" size={28} /> Delivery Address
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Street Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
              <Input
                value={deliveryAddress.address}
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    address: e.target.value,
                  })
                }
                className="h-14 pl-12 rounded-xl bg-muted/5 border-border/40 font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                City
              </Label>
              <Input
                value={deliveryAddress.city}
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    city: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/5 border-border/40 font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Sub-City / Area
              </Label>
              <Input
                value={deliveryAddress.postalCode}
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    postalCode: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/5 border-border/40 font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Special Instructions
            </Label>
            <Textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="min-h-[100px] rounded-xl bg-muted/5 border-border/40 font-bold resize-none"
              placeholder="Any special requirements for production or delivery..."
            />
          </div>

          <div className="pt-2 flex gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="h-14 w-20 rounded-2xl border-border/40 hover:bg-muted transition-all shrink-0"
            >
              <ArrowLeft size={18} />
            </Button>
            <Button
              type="submit"
              className="flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-4 group"
            >
              Review Order
              <ArrowRight
                size={18}
                className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}

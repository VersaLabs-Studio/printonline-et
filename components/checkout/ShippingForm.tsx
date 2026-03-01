"use client";

import React from "react";
import { Truck, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingFormProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ShippingForm({
  data,
  onChange,
  onNext,
  onBack,
}: ShippingFormProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl border border-border/40 p-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
          Step 2 of 3
        </h3>
        <h2 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
          <Truck className="text-primary" size={28} /> Delivery Address
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
          >
            Street Address
          </Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <Input
              id="address"
              placeholder="Building name, Office Number, Landmarks..."
              value={data.address}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              className="h-14 pl-12 rounded-xl border-border/40 bg-muted/5 font-bold focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              City
            </Label>
            <Select
              value={data.city}
              onValueChange={(val) => onChange({ ...data, city: val })}
            >
              <SelectTrigger className="h-12 rounded-xl border-border/40 bg-muted/5 font-bold">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Addis Ababa" className="font-bold">
                  Addis Ababa
                </SelectItem>
                <SelectItem value="Adama" className="font-bold">
                  Adama
                </SelectItem>
                <SelectItem value="Hawassa" className="font-bold">
                  Hawassa
                </SelectItem>
                <SelectItem value="Bahir Dar" className="font-bold">
                  Bahir Dar
                </SelectItem>
                <SelectItem value="Mekelle" className="font-bold">
                  Mekelle
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="postalCode"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              Sub-City / Area
            </Label>
            <Input
              id="postalCode"
              placeholder="e.g. Bole, Kirkos, Arada..."
              value={data.postalCode}
              onChange={(e) =>
                onChange({ ...data, postalCode: e.target.value })
              }
              className="h-12 rounded-xl border-border/40 bg-muted/5 font-bold focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-14 w-20 rounded-2xl border-border/40 hover:bg-muted transition-all shrink-0"
          >
            <ArrowLeft size={18} />
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-sm hover:shadow-xl hover:shadow-primary/20 gap-4 group"
          >
            Continue to Payment
            <ArrowRight
              size={18}
              className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

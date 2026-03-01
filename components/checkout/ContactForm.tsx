"use client";

import React from "react";
import { User, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function ContactForm({ data, onChange, onNext }: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Step 1 of 3
        </h3>
        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
          <User className="text-primary" size={28} /> Contact Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="e.g. Kidus"
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              className="h-12 rounded-xl border-border/40 bg-muted/5 font-bold focus:ring-primary/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="e.g. Abdula"
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              className="h-12 rounded-xl border-border/40 bg-muted/5 font-bold focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="h-14 pl-12 rounded-xl border-border/40 bg-muted/5 font-bold focus:ring-primary/20 text-lg tracking-tight"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
          >
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <Input
              id="phone"
              type="tel"
              placeholder="+251 9... or +251 7..."
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              className="h-14 pl-12 rounded-xl border-border/40 bg-muted/5 font-bold focus:ring-primary/20 text-lg tracking-tight"
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

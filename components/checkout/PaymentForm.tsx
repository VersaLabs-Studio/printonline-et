"use client";

import React from "react";
import {
  CreditCard,
  Wallet,
  Landmark,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  method: string;
  onMethodChange: (method: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isProcessing: boolean;
  total: number;
}

export function PaymentForm({
  method,
  onMethodChange,
  onSubmit,
  onBack,
  isProcessing,
  total,
}: PaymentFormProps) {
  const methods = [
    {
      id: "mobile",
      label: "Mobile Money",
      icon: Wallet,
      desc: "Telebirr, M-Pesa, CBE Birr",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      icon: CreditCard,
      desc: "Visa, Mastercard, Local Debit",
    },
    {
      id: "bank",
      label: "Bank Transfer",
      icon: Landmark,
      desc: "Commercial Bank, Dashen, Awash",
    },
  ];

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Step 3 of 3
        </h3>
        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
          <ShieldCheck className="text-primary" size={28} /> Payment Method
        </h2>
      </div>

      <div className="space-y-8">
        <RadioGroup
          value={method}
          onValueChange={onMethodChange}
          className="grid grid-cols-1 gap-4"
        >
          {methods.map((m) => (
            <div key={m.id} className="relative">
              <RadioGroupItem value={m.id} id={m.id} className="peer sr-only" />
              <Label
                htmlFor={m.id}
                className={cn(
                  "flex items-center gap-5 p-5 rounded-2xl border-2 border-border/40 bg-card hover:bg-muted/50 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 group",
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-peer-data-[state=checked]:bg-primary group-peer-data-[state=checked]:text-white transition-all shadow-inner">
                  <m.icon size={24} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-black uppercase tracking-tight">
                    {m.label}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-widest leading-none">
                    {m.desc}
                  </p>
                </div>
                <div className="opacity-0 group-peer-data-[state=checked]:opacity-100 transition-opacity">
                  <CheckCircle2 size={24} className="text-primary" />
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
              Order Total
            </span>
            <span className="text-2xl font-black text-primary tracking-tighter">
              ETB {total.toLocaleString()}
            </span>
          </div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase text-center opacity-60">
            Your payment is securely processed via local Ethiopian payment
            gateways.
          </p>
        </div>

        <div className="pt-2 flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            className="h-14 w-20 rounded-2xl border-border/40 hover:bg-muted transition-all shrink-0"
          >
            <ArrowLeft size={18} />
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isProcessing}
            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-4 group active:scale-95 transition-all overflow-hidden relative"
          >
            {isProcessing ? (
              <div className="absolute inset-0 bg-primary flex items-center justify-center gap-3">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">Processing...</span>
              </div>
            ) : (
              <>
                Place Order
                <ArrowRight
                  size={18}
                  className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

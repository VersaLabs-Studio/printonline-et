"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function TermsCheckbox({ checked, onCheckedChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-muted/5 border border-border/20">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(val: boolean) => onCheckedChange(val)}
        className="mt-1"
      />
      <div className="space-y-1">
        <Label
          htmlFor="terms"
          className="text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer"
        >
          I accept the Terms and Conditions
        </Label>
        <p className="text-[10px] font-medium text-muted-foreground uppercase leading-relaxed">
          By placing this order, you agree to our standard printing terms, 
          privacy policy, and production lead times. 
          <Dialog>
            <DialogTrigger className="ml-1 text-primary hover:underline font-bold">
              View Policies
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col rounded-3xl p-0 overflow-hidden border-border/40">
              <DialogHeader className="p-8 border-b border-border/40 bg-muted/5">
                <DialogTitle className="text-xl font-bold uppercase tracking-tight">
                  Standard Printing Terms
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 p-8">
                <div className="space-y-6 text-sm text-foreground/80 font-medium leading-relaxed">
                  <section className="space-y-3">
                    <h4 className="font-bold uppercase tracking-widest text-[10px] text-primary">
                      1. File Quality & Proofing
                    </h4>
                    <p>
                      Customers are responsible for the quality of files uploaded. 
                      PrintOnline Ethiopia is not liable for pixelation, spelling errors, 
                      or low-resolution graphics in customer-provided designs. 
                      Color accuracy may vary ±10% depending on substrate and machine calibration.
                    </p>
                  </section>
                  <section className="space-y-3">
                    <h4 className="font-bold uppercase tracking-widest text-[10px] text-primary">
                      2. Production & Timelines
                    </h4>
                    <p>
                      Standard production timelines are estimates and begin only after 
                      payment confirmation and design approval. Rush production is available 
                      for a surcharge but does not guarantee same-day delivery unless 
                      explicitly confirmed.
                    </p>
                  </section>
                  <section className="space-y-3">
                    <h4 className="font-bold uppercase tracking-widest text-[10px] text-primary">
                      3. Returns & Refunds
                    </h4>
                    <p>
                      As these are custom-manufactured products, refunds are only issued 
                      in cases of clear manufacturing defects or shipping damage verified 
                      upon receipt. Change of mind is not grounds for return.
                    </p>
                  </section>
                  <section className="space-y-3">
                    <h4 className="font-bold uppercase tracking-widest text-[10px] text-primary">
                      4. Payments
                    </h4>
                    <p>
                      Full payment is required for all orders before production begins. 
                      We accept bank transfers, mobile money (Telebirr, CBE Birr), and 
                      other approved digital payment methods.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </div>
  );
}

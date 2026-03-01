"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductWithDetails } from "@/types";
import { motion } from "framer-motion";
import {
  Settings,
  ShieldCheck,
  Truck,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ProductTabsProps {
  product: ProductWithDetails;
}

export function ProductTabs({ product }: ProductTabsProps) {
  // Parse dynamic JSON fields if they exist
  const features = Array.isArray(product.features) ? product.features : [];
  const specifications =
    typeof product.specifications === "object" &&
    product.specifications !== null
      ? Object.entries(product.specifications as Record<string, string>)
      : [];

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full h-14 bg-muted/20 p-1.5 rounded-2xl border border-border/40 mb-8 flex justify-start overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="overview"
            className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg h-full"
          >
            <Info size={14} /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg h-full"
          >
            <Settings size={14} /> Specifications
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg h-full"
          >
            <Truck size={14} /> Production & Delivery
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[300px] border border-border/40 rounded-4xl p-10 bg-card/30 backdrop-blur-sm shadow-inner relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <TabsContent value="overview" className="mt-0 focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Comprehensive Product Intelligence
                </h3>
                <p className="text-lg font-medium text-foreground/80 leading-relaxed max-w-3xl">
                  {product.description ||
                    "Unlocking new possibilities in professional printing. This solution is engineered for high-impact results and long-lasting durability."}
                </p>
              </div>

              {features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-muted/10 border border-border/20"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <span className="text-sm font-bold text-foreground/80">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="specs" className="mt-0 focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Technical Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {specifications.length > 0 ? (
                  specifications.map(([key, value], idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 border-b border-border/40 group hover:border-primary/40 transition-colors"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                        {key}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center text-muted-foreground italic font-medium">
                    Standard specifications apply. Detailed technical sheet
                    available upon request.
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-0 focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <DeliveryCard
                icon={Clock}
                title="Turnaround"
                value="24-48 Hours"
                desc="Post-verification production cycle in our local Addis studio."
              />
              <DeliveryCard
                icon={Truck}
                title="Fulfillment"
                value="City-Wide Delivery"
                desc="Rapid dispatch across all sub-cities via our logistics network."
              />
              <DeliveryCard
                icon={ShieldCheck}
                title="Assurance"
                value="Quality Shield"
                desc="Triple-point inspection for color accuracy and finish integrity."
              />
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function DeliveryCard({
  icon: Icon,
  title,
  value,
  desc,
}: {
  icon: any;
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="space-y-4 p-6 rounded-4xl bg-muted/5 border border-border/40 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5 group">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
        <Icon size={24} />
      </div>
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {title}
        </h4>
        <p className="text-xl font-black tracking-tight">{value}</p>
        <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">
          {desc}
        </p>
      </div>
    </div>
  );
}

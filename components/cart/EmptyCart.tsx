"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-32 h-32 bg-muted/20 rounded-[3rem] flex items-center justify-center text-muted-foreground/30 shadow-inner">
          <ShoppingBag size={56} />
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-primary/10 rounded-full blur-xl" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground uppercase">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground font-bold leading-relaxed">
            You haven&apos;t added any items yet. Browse our print solutions to
            find what you need.
          </p>
        </div>

        <Button
          asChild
          className="h-14 px-8 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-sm hover:shadow-xl hover:shadow-primary/20 group"
        >
          <Link href="/all-products">
            Browse Products
            <ArrowRight
              size={18}
              className="ml-3 group-hover:translate-x-1 transition-transform opacity-50"
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}

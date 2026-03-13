"use client";

import React, { use } from "react";
import { useCustomer } from "@/hooks/data/useCustomers";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CMSPageContainer } from "@/components/cms/shared/CMSPageContainer";
import { CustomerProfileInfo } from "@/components/cms/customers/CustomerProfileInfo";
import { CustomerOrderHistory } from "@/components/cms/customers/CustomerOrderHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, UserPlus, FileText, Share2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: customer, isLoading, error } = useCustomer(id);

  if (isLoading) {
    return (
      <div className="space-y-8 pb-10">
        <div className="flex items-center gap-4 mb-8">
           <Skeleton className="h-10 w-10 rounded-xl" />
           <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
           </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Skeleton className="h-[600px] w-full rounded-2xl" />
           <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6 bg-destructive/5 rounded-3xl border border-destructive/10">
        <div className="h-20 w-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center">
          <ChevronLeft size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Personnel Retrieval Failed</h2>
          <p className="text-muted-foreground font-medium mt-2">The requested customer record could not be synchronized with the master database.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl font-bold gap-2">
           <Link href="/cms/customers">
             <ChevronLeft size={18} /> Return to Directory
           </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-muted/30 hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
                <Link href="/cms/customers">
                  <ChevronLeft size={24} />
                </Link>
             </Button>
             <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
                  {customer.full_name} 
                  <div className={`h-2.5 w-2.5 rounded-full ${customer.is_active ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-destructive"}`} />
                </h1>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                   Profile Identification: <span className="font-mono text-primary">{customer.id.substring(0, 8).toUpperCase()}</span>
                </p>
             </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 border-border/40 hover:bg-muted/50">
                <Share2 size={16} /> Data Export
             </Button>
             <Button className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <FileText size={16} /> Manual Invoice
             </Button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
             <CustomerProfileInfo customer={customer} />
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-card border border-border/40 space-y-4">
                   <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <UserPlus size={20} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Tier</h4>
                      <p className="text-lg font-black tracking-tighter mt-1">{customer.is_active ? "Tier-01 Enterprise" : "Suspended"}</p>
                   </div>
                </div>
                <div className="p-6 rounded-3xl bg-primary text-primary-foreground space-y-4 shadow-xl shadow-primary/10">
                   <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <FileText size={20} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70">Tax Compliance</h4>
                      <p className="text-lg font-black tracking-tighter mt-1">{customer.tin_number ? "Verified TIN" : "Personal Only"}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <CustomerOrderHistory customerId={customer.id} />
          </div>
       </div>
    </div>
  );
}

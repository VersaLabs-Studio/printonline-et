"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ChevronRight, 
  ExternalLink,
  History,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { format } from "date-fns";
import Link from "next/link";
import { useCustomerOrders } from "@/hooks/data/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerOrderHistoryProps {
  customerId: string;
}

export function CustomerOrderHistory({ customerId }: CustomerOrderHistoryProps) {
  const { data: orders, isLoading } = useCustomerOrders(customerId);

  if (isLoading) {
    return (
      <Card className="border-border/40 shadow-sm rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="py-5 px-8 border-b border-border/40">
           <Skeleton className="h-6 w-48 rounded-lg" />
        </CardHeader>
        <CardContent className="p-8 space-y-4">
           {[1, 2, 3].map((i) => (
             <Skeleton key={i} className="h-20 w-full rounded-2xl" />
           ))}
        </CardContent>
      </Card>
    );
  }

  const totalSpent = orders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

  return (
    <Card className="border-border/40 shadow-sm rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between py-5 px-8 border-b border-border/40 bg-muted/10">
        <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-foreground/70">
          <History size={18} className="text-primary" /> Commerce Activity
        </CardTitle>
        <Badge variant="secondary" className="rounded-full px-3 py-1 font-mono text-[10px]">
          {orders?.length || 0} Transactions
        </Badge>
      </CardHeader>
      
      <div className="p-8 border-b border-border/40 bg-primary/[0.02] flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Lifetime Expenditure</span>
            <div className="flex items-baseline gap-1.5">
               <span className="text-xs font-bold text-primary/40 uppercase tracking-tighter">ETB</span>
               <PriceDisplay amount={totalSpent} className="text-3xl font-black text-primary tracking-tighter" />
            </div>
         </div>
         <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <TrendingUp size={20} />
         </div>
      </div>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto divide-y divide-border/20">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Link 
                key={order.id} 
                href={`/cms/orders/${order.id}`}
                className="block p-6 hover:bg-primary/[0.03] transition-colors group relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-background border border-border/40 flex items-center justify-center group-hover:border-primary/40 transition-all text-muted-foreground group-hover:text-primary shadow-sm">
                        <Package size={20} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">{order.order_number}</span>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase tracking-widest h-4 py-0 px-2 rounded-full",
                            getStatusColor(order.status)
                          )}>
                             {order.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                          {format(new Date(order.created_at || new Date()), "MMM dd, yyyy")} • {order.payment_method || "Invoice"}
                        </span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right flex flex-col items-end">
                         <PriceDisplay amount={order.total_amount} className="font-bold text-sm tracking-tight" />
                         <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                            <CreditCard size={8} /> {order.payment_status}
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
                   </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-3xl bg-muted/20 flex items-center justify-center text-muted-foreground/30">
                <Package size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Transaction Log Empty</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-[200px] mx-auto leading-relaxed">The customer has not initialized any procurement requests yet.</p>
              </div>
            </div>
          )}
        </div>
        
        {orders && orders.length > 0 && (
          <div className="p-4 bg-muted/5 border-t border-border/40 flex justify-center">
             <Button variant="ghost" asChild className="text-[9px] font-black uppercase tracking-widest h-8 gap-2 hover:bg-primary/5 hover:text-primary rounded-xl">
                <Link href={`/cms/orders?customer=${customerId}`}>
                  View Complete Ledger <ExternalLink size={10} />
                </Link>
             </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
    case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
    case "ready": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "delivered": return "bg-emerald-500 text-white";
    case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-primary/10 text-primary border-primary/20";
  }
}

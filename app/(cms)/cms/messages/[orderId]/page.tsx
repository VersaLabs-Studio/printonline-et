// app/(cms)/cms/messages/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { authClient } from "@/lib/auth-client";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { MessagePortal } from "@/components/chat/MessagePortal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  User,
  ShoppingBag,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

interface OrderInfo {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  customer: {
    full_name: string;
    email: string;
    phone: string | null;
    auth_user_id: string;
  } | null;
}

export default function CMSMessageThreadPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { data: session } = authClient.useSession();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("orders")
          .select(
            "id, order_number, status, created_at, customer:customer_profiles!customer_id(full_name, email, phone, auth_user_id)"
          )
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data as unknown as OrderInfo);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) loadOrder();
  }, [orderId]);

  const adminUserId = session?.user?.id || "";
  const customerAuthId = order?.customer?.auth_user_id || "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CMSPageHeader
        title="Conversation"
        subtitle={
          order
            ? `${order.order_number} · ${order.customer?.full_name || "Unknown Customer"}`
            : "Message thread"
        }
        backHref="/cms/messages"
        breadcrumbs={[
          { label: "Messages", href: "/cms/messages" },
          { label: order?.order_number || orderId.slice(0, 8) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Message thread — main area */}
        <div className="lg:col-span-3">
          {adminUserId && customerAuthId ? (
            <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border/20 bg-muted/5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Customer Messages
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Replying as admin to {order?.customer?.full_name || "customer"}
                  </p>
                </div>
              </div>
              <MessagePortal
                orderId={orderId}
                currentUserId={adminUserId}
                recipientId={customerAuthId}
                isAdmin={true}
              />
            </Card>
          ) : (
            <Card className="border-border/40 rounded-2xl p-10 text-center">
              <p className="text-muted-foreground text-sm">
                Unable to load conversation. Customer or order data not found.
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar — order & customer info */}
        <div className="space-y-6">
          {/* Customer info */}
          {order?.customer && (
            <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border/20 bg-muted/5">
                <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                  <User size={14} /> Customer
                </h5>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold">{order.customer.full_name}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail size={12} />
                  <span className="truncate">{order.customer.email}</span>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone size={12} />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Order info */}
          {order && (
            <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border/20 bg-muted/5">
                <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                  <ShoppingBag size={14} /> Order
                </h5>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase tracking-wider"
                >
                  {order.status?.replace(/_/g, " ") || "Unknown"}
                </Badge>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl gap-2 text-xs font-bold mt-2"
                >
                  <Link href={`/cms/orders/${orderId}`}>
                    View Order <ArrowRight size={12} />
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

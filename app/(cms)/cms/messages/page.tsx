// app/(cms)/cms/messages/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllMessages } from "@/lib/supabase/messages";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import {
  MessageSquare,
  Loader2,
  Clock,
  User,
  Shield,
  Search,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  order_id: string | null;
  message: string;
  is_admin: boolean;
  read_at: string | null;
  created_at: string;
}

interface OrderInfo {
  id: string;
  order_number: string;
  customer_name: string;
  customer_auth_id: string;
}

export default function CMSMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [orders, setOrders] = useState<Record<string, OrderInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();

    const interval = setInterval(() => loadData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData(silent = false) {
    try {
      const { data, error } = await getAllMessages();
      if (error) throw error;
      setMessages(data || []);

      const orderIds = Array.from(
        new Set((data || []).map((m) => m.order_id).filter(Boolean))
      ) as string[];

      if (orderIds.length > 0) {
        const supabase = createClient();
        const { data: orderRows } = await supabase
          .from("orders")
          .select("id, order_number, customer:customer_profiles!customer_id(full_name, auth_user_id)")
          .in("id", orderIds);

        const orderMap: Record<string, OrderInfo> = {};
        (orderRows || []).forEach((o: any) => {
          orderMap[o.id] = {
            id: o.id,
            order_number: o.order_number,
            customer_name: o.customer?.full_name || "Unknown Customer",
            customer_auth_id: o.customer?.auth_user_id || "",
          };
        });
        setOrders(orderMap);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }

  const messagesByOrder = messages.reduce(
    (groups: Record<string, Message[]>, msg) => {
      const key = msg.order_id || "general";
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
      return groups;
    },
    {}
  );

  const filteredThreads = Object.entries(messagesByOrder).filter(
    ([orderId, orderMessages]) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const orderInfo = orders[orderId];
      if (orderInfo?.order_number.toLowerCase().includes(q)) return true;
      if (orderInfo?.customer_name.toLowerCase().includes(q)) return true;
      return orderMessages.some((m) => m.message?.toLowerCase().includes(q));
    }
  );

  const totalUnread = messages.filter((m) => !m.is_admin && !m.read_at).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CMSPageHeader
          title="Messages"
          subtitle="Manage customer conversations across all orders."
          breadcrumbs={[{ label: "Messages" }]}
        />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Messages"
        subtitle="Manage customer conversations across all orders."
        breadcrumbs={[{ label: "Messages" }]}
        actions={
          <div className="flex items-center gap-3">
            {totalUnread > 0 && (
              <Badge className="bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold">
                {totalUnread} unread
              </Badge>
            )}
            <Button
              variant="outline"
              className="rounded-xl gap-2 font-bold border-border/60 hover:bg-muted/50"
              onClick={() => loadData()}
            >
              <RefreshCcw size={16} />
              Sync
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order, customer, or message..."
          className="pl-10 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Thread list */}
      <div className="space-y-3">
        {filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="text-muted-foreground" size={40} />
            </div>
            <h2 className="text-lg font-semibold uppercase tracking-wider">
              {searchQuery ? "No matching conversations" : "No messages yet"}
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">
              {searchQuery
                ? "Try a different search term."
                : "Customer messages will appear here when they start a conversation."}
            </p>
          </div>
        ) : (
          filteredThreads.map(([orderId, orderMessages]) => {
            const lastMessage = orderMessages[0];
            const orderInfo = orders[orderId];
            const unreadInThread = orderMessages.filter(
              (m) => !m.is_admin && !m.read_at
            ).length;
            const totalInThread = orderMessages.length;
            const hasAdminMessages = orderMessages.some((m) => m.is_admin);
            const hasCustomerMessages = orderMessages.some((m) => !m.is_admin);

            return (
              <Link
                key={orderId}
                href={`/cms/messages/${orderId}`}
                className="block"
              >
                <div className="bg-card border border-border/40 rounded-2xl p-5 hover:bg-muted/20 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Order & customer info */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {orderId !== "general" ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                              <ShoppingBag size={12} />
                              {orderInfo?.order_number || `Order #${orderId.slice(0, 8)}`}
                            </span>
                            {orderInfo?.customer_name && (
                              <>
                                <span className="text-muted-foreground/40 text-xs">·</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                  <User size={11} />
                                  {orderInfo.customer_name}
                                </span>
                              </>
                            )}
                          </>
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            General
                          </span>
                        )}
                        {unreadInThread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold">
                            {unreadInThread} new
                          </Badge>
                        )}
                      </div>

                      {/* Last message preview */}
                      <p className="text-sm text-foreground truncate max-w-xl">
                        {lastMessage.is_admin && (
                          <span className="text-primary font-semibold text-xs mr-1">You:</span>
                        )}
                        {lastMessage.message || (lastMessage as any).attachments?.length
                          ? lastMessage.message || "Sent an attachment"
                          : "No content"}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {lastMessage.is_admin ? (
                            <Shield size={11} className="text-primary" />
                          ) : (
                            <User size={11} />
                          )}
                          {lastMessage.is_admin ? "Admin" : "Customer"}
                        </span>
                        <span className="text-muted-foreground/30">·</span>
                        <span>{totalInThread} message{totalInThread !== 1 ? "s" : ""}</span>
                        {hasAdminMessages && hasCustomerMessages && (
                          <>
                            <span className="text-muted-foreground/30">·</span>
                            <span className="text-emerald-600 font-medium">Active</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{format(new Date(lastMessage.created_at), "MMM dd, h:mm a")}</span>
                      </div>
                      {unreadInThread > 0 && (
                        <div className="h-2 w-2 bg-primary rounded-full mt-3 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

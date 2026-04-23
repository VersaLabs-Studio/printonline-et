// app/(account)/messages/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getUserMessages, getUnreadCount, subscribeToUnreadCount } from "@/lib/supabase/messages";
import { format } from "date-fns";
import { MessageSquare, ArrowLeft, Loader2, Clock, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function MessagesInboxPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    async function loadMessages() {
      try {
        const { data, error } = await getUserMessages(session.user.id);
        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();

    // Subscribe to unread count updates
    const { unsubscribe } = subscribeToUnreadCount(session.user.id, (count) => {
      setUnreadCount(count);
    });

    return () => {
      unsubscribe();
    };
  }, [session?.user?.id]);

  if (isSessionPending || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group messages by order
  const messagesByOrder = messages.reduce((groups: Record<string, Message[]>, msg) => {
    const key = msg.order_id || "general";
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(msg);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/account">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Messages</h1>
            <p className="text-muted-foreground text-sm">
              Your conversations with our team
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="bg-primary text-primary-foreground px-3 py-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Message threads */}
      <div className="space-y-4">
        {Object.keys(messagesByOrder).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="text-muted-foreground" size={40} />
            </div>
            <h2 className="text-lg font-semibold uppercase tracking-wider">No messages yet</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">
              When you send a message about an order, it will appear here.
            </p>
          </div>
        ) : (
          Object.entries(messagesByOrder).map(([orderId, orderMessages]) => {
            const lastMessage = orderMessages[0];
            const unreadInThread = orderMessages.filter(
              (m) => m.recipient_id === session?.user?.id && !m.read_at
            ).length;

            return (
              <Link
                key={orderId}
                href={`/messages/${orderId}`}
                className="block"
              >
                <div className="bg-card border border-border/40 rounded-2xl p-6 hover:bg-muted/20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {orderId !== "general" ? (
                          <>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                              Order #{orderId.slice(0, 8)}
                            </span>
                            {unreadInThread > 0 && (
                              <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                                {unreadInThread} new
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            General
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground truncate">
                        {lastMessage.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        {lastMessage.sender_id === session?.user?.id ? (
                          <>
                            <CheckCheck size={14} />
                            <span>You</span>
                          </>
                        ) : (
                          <>
                            {lastMessage.is_admin && (
                              <span className="text-primary font-semibold">Admin</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>
                          {format(new Date(lastMessage.created_at), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                      {unreadInThread > 0 && (
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 ml-auto" />
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

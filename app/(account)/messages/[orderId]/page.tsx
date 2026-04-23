// app/(account)/messages/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getMessagesByOrder, sendMessage, markOrderMessagesAsRead, subscribeToOrderMessages } from "@/lib/supabase/messages";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { toast } from "sonner";

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

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function MessageThreadPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  // Load admin users and determine if current user is admin
  useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await fetch("/api/cms/users/admins");
        if (!res.ok) return;
        const data = await res.json();
        setAdmins(data.admins || []);
        
        // Check if current user is an admin
        if (session?.user?.id) {
          const currentIsAdmin = data.admins?.some((a: AdminUser) => a.id === session.user.id);
          setIsAdminUser(currentIsAdmin);
        }
      } catch (error) {
        console.error("Failed to load admins:", error);
      }
    }

    if (session?.user?.id) {
      loadAdmins();
    }
  }, [session?.user?.id]);

  // Load order details
  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrderDetails(data.order);
        // Store customer ID for admin replies
        if (data.order?.customer_id) {
          setCustomerId(data.order.customer_id);
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  // Load messages
  useEffect(() => {
    if (!session?.user?.id || !orderId) return;

    async function loadMessages() {
      try {
        const { data, error } = await getMessagesByOrder(orderId);
        if (error) throw error;
        setMessages(data || []);
        
        // Mark as read
        await markOrderMessagesAsRead(orderId, session!.user.id);
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();

    // Subscribe to new messages
    const { unsubscribe } = subscribeToOrderMessages(orderId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      unsubscribe();
    };
  }, [orderId, session?.user?.id]);

  const handleSend = async (message: string) => {
    if (!session?.user?.id) return;

    setIsSending(true);
    try {
      let recipientId: string;
      let senderIsAdmin = false;

      if (isAdminUser) {
        // Admin is replying — send to customer
        if (!customerId) {
          toast.error("Customer not found for this order");
          return;
        }
        recipientId = customerId;
        senderIsAdmin = true;
      } else {
        // Customer is messaging — send to first available admin
        if (admins.length === 0) {
          toast.error("No admins available to receive messages");
          return;
        }
        recipientId = admins[0].id;
        senderIsAdmin = false;
      }
      
      const { data, error } = await sendMessage({
        senderId: session.user.id,
        recipientId,
        orderId,
        message,
        isAdmin: senderIsAdmin,
      });

      if (error) throw error;

      if (data) {
        setMessages((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isSessionPending || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/messages">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Message Thread</h1>
          {orderDetails && (
            <Link
              href={`/orders/${orderId}`}
              className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
            >
              <Package size={14} />
              Order #{orderDetails.order_number || orderId.slice(0, 8)}
            </Link>
          )}
        </div>
      </div>

      {/* Order summary card */}
      {orderDetails && (
        <div className="bg-muted/10 border border-border/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Order Status
              </p>
              <p className="text-sm font-semibold mt-1 capitalize">
                {orderDetails.status?.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total
              </p>
              <p className="text-sm font-semibold mt-1">
                {orderDetails.total_amount?.toLocaleString()} ETB
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date
              </p>
              <p className="text-sm font-semibold mt-1">
                {orderDetails.created_at ? format(new Date(orderDetails.created_at), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex flex-col gap-4">
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          {/* Messages list */}
          <div className="h-[400px] overflow-y-auto px-6 py-4">
            <MessageList 
              messages={messages} 
              currentUserId={session?.user?.id || ''} 
            />
          </div>

          {/* Input */}
          <div className="border-t border-border/20 px-6 py-4 bg-muted/10">
            <MessageInput 
              onSend={handleSend} 
              isLoading={isSending}
              placeholder="Type your message about this order..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

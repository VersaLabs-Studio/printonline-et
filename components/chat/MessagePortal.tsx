// components/chat/MessagePortal.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { 
  getMessagesByOrder, 
  sendMessage, 
  markOrderMessagesAsRead,
  subscribeToOrderMessages 
} from "@/lib/supabase/messages";
import { toast } from "sonner";

interface MessagePortalProps {
  orderId: string;
  currentUserId: string;
  adminId: string;
}

export function MessagePortal({ orderId, currentUserId, adminId }: MessagePortalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on mount
  useEffect(() => {
    async function loadMessages() {
      try {
        const { data, error } = await getMessagesByOrder(orderId);
        if (error) throw error;
        setMessages(data || []);
        
        // Mark messages as read
        await markOrderMessagesAsRead(orderId, currentUserId);
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [orderId, currentUserId]);

  // Subscribe to new messages
  useEffect(() => {
    const { unsubscribe } = subscribeToOrderMessages(orderId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [orderId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message: string) => {
    setIsSending(true);
    try {
      const { data, error } = await sendMessage({
        senderId: currentUserId,
        recipientId: adminId,
        orderId,
        message,
      });

      if (error) throw error;

      // Optimistic update
      setMessages((prev) => [...prev, data]);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border/20 px-6 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Message Thread
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Chat with our team about this order
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <MessageList messages={messages} currentUserId={currentUserId} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/20 px-6 py-4 bg-muted/10">
        <MessageInput onSend={handleSend} isLoading={isSending} />
      </div>
    </div>
  );
}

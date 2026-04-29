// components/chat/MessagePortal.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import {
  getMessagesByOrder,
  sendMessage,
  markOrderMessagesAsRead,
  subscribeToOrderMessages,
  uploadMessageFile,
  type MessageAttachment,
} from "@/lib/supabase/messages";
import { toast } from "sonner";

interface MessagePortalProps {
  orderId: string;
  currentUserId: string;
  recipientId: string;
  isAdmin?: boolean;
}

export function MessagePortal({ orderId, currentUserId, recipientId, isAdmin = false }: MessagePortalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on mount and after mark-as-read
  const loadMessages = useCallback(async (shouldMarkRead = false) => {
    try {
      const { data, error } = await getMessagesByOrder(orderId);
      if (error) throw error;
      setMessages(data || []);

      if (shouldMarkRead) {
        const { error: markError, updatedCount } = await markOrderMessagesAsRead(orderId, currentUserId);
        if (!markError && updatedCount && updatedCount > 0) {
          // Refetch to get the true server state after marking read
          const { data: refreshed } = await getMessagesByOrder(orderId);
          if (refreshed) setMessages(refreshed);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [orderId, currentUserId]);

  useEffect(() => {
    loadMessages(true);
  }, [loadMessages]);

  // Polling fallback: refetch every 30s to catch missed realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Refetch on window focus to catch updates while tab was backgrounded
  useEffect(() => {
    const handleFocus = () => {
      loadMessages(true);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadMessages]);

  // Subscribe to new messages and read status updates
  useEffect(() => {
    const { unsubscribe } = subscribeToOrderMessages(orderId, (updatedMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === updatedMessage.id);
        if (exists) {
          return prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m));
        }
        return [...prev, updatedMessage];
      });

      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [orderId]);

  const handleSend = async (text: string, attachments: MessageAttachment[]) => {
    setIsSending(true);
    try {
      const { error } = await sendMessage({
        senderId: currentUserId,
        recipientId,
        orderId,
        message: text,
        isAdmin,
        attachments,
      });

      if (error) throw error;

      // Realtime subscription will append the message
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    return uploadMessageFile(file, orderId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto -mx-2 w-full">
        <MessageList messages={messages} currentUserId={currentUserId} currentUserIsAdmin={true} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 pt-4 border-t border-border/20">
        <MessageInput
          onSend={handleSend}
          isLoading={isSending}
          onUploadFile={handleUploadFile}
          placeholder="Type a message or attach a file..."
        />
      </div>
    </div>
  );
}

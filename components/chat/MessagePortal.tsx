// components/chat/MessagePortal.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
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
}

export function MessagePortal({ orderId, currentUserId, recipientId }: MessagePortalProps) {
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
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
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
      <div className="flex-1 overflow-y-auto -mx-2">
        <MessageList messages={messages} currentUserId={currentUserId} />
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

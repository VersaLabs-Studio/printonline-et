// lib/supabase/messages.ts
// Message CRUD operations for user-admin messaging system
// NOTE: All write operations go through authenticated API routes because
// the app uses better-auth (not Supabase Auth), so auth.uid() RLS policies
// do not work. Realtime subscriptions still use the browser client.

import { createClient } from './client';

export interface MessageAttachment {
  url: string;
  name: string;
  type: string;
  size: number;
  category: 'image' | 'video' | 'document';
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  order_id: string | null;
  message: string;
  is_admin: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  attachments: MessageAttachment[];
}

export interface SendMessageParams {
  senderId: string;
  recipientId: string;
  orderId?: string;
  message: string;
  isAdmin?: boolean;
  attachments?: MessageAttachment[];
}

/**
 * Upload a file for a message attachment
 */
export async function uploadMessageFile(
  file: File,
  orderId?: string
): Promise<{ attachment: MessageAttachment | null; error: string | null }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (orderId) formData.append("orderId", orderId);

    const res = await fetch("/api/upload/message", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
      return { attachment: null, error: json.error || json.details || `HTTP ${res.status}` };
    }

    return { attachment: json.attachment, error: null };
  } catch (err) {
    return { attachment: null, error: err instanceof Error ? err.message : "Upload failed" };
  }
}

/**
 * Send a new message via authenticated API route
 */
export async function sendMessage(params: SendMessageParams): Promise<{ data: Message | null; error: any }> {
  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("[sendMessage] API error:", json);
      return { data: null, error: json.error || `HTTP ${res.status}` };
    }

    return { data: json.message as Message, error: null };
  } catch (err) {
    console.error("[sendMessage] Network error:", err);
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Get messages for a specific order via authenticated API route
 */
export async function getMessagesByOrder(orderId: string): Promise<{ data: Message[] | null; error: any }> {
  try {
    const res = await fetch(`/api/messages?orderId=${encodeURIComponent(orderId)}`);
    const json = await res.json();

    if (!res.ok) {
      console.error("[getMessagesByOrder] API error:", json);
      return { data: null, error: json.error || `HTTP ${res.status}` };
    }

    return { data: (json.messages || []) as Message[], error: null };
  } catch (err) {
    console.error("[getMessagesByOrder] Network error:", err);
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Get all messages for a user (sent or received) — direct Supabase query
 */
export async function getUserMessages(userId: string): Promise<{ data: Message[] | null; error: any }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  return { data: data as Message[] | null, error };
}

/**
 * Get unread message count for a user — direct Supabase query
 */
export async function getUnreadCount(userId: string): Promise<{ count: number; error: any }> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("messages")
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .is('read_at', null);

  return { count: count || 0, error };
}

/**
 * Mark a message as read — direct Supabase query
 */
export async function markAsRead(messageId: string): Promise<{ error: any }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  return { error };
}

/**
 * Mark all messages in an order as read for a user via authenticated API route
 */
export async function markOrderMessagesAsRead(orderId: string, userId: string): Promise<{ error: any }> {
  try {
    const res = await fetch("/api/messages/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, userId }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("[markOrderMessagesAsRead] API error:", json);
      return { error: json.error || `HTTP ${res.status}` };
    }

    return { error: null };
  } catch (err) {
    console.error("[markOrderMessagesAsRead] Network error:", err);
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Subscribe to new messages for real-time updates
 */
export function subscribeToOrderMessages(
  orderId: string,
  callback: (message: Message) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`order-messages-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Subscribe to unread count updates
 */
export function subscribeToUnreadCount(
  userId: string,
  callback: (count: number) => void
) {
  const supabase = createClient();

  // Initial count
  getUnreadCount(userId).then(({ count }) => callback(count));

  const channel = supabase
    .channel(`unread-count-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      async () => {
        const { count } = await getUnreadCount(userId);
        callback(count);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      async () => {
        const { count } = await getUnreadCount(userId);
        callback(count);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

// lib/supabase/messages.ts
// Message CRUD operations for user-admin messaging system

import { createClient } from './client';
import { supabaseAdmin } from './admin';

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
}

export interface SendMessageParams {
  senderId: string;
  recipientId: string;
  orderId?: string;
  message: string;
  isAdmin?: boolean;
}

/**
 * Send a new message
 */
export async function sendMessage(params: SendMessageParams): Promise<{ data: Message | null; error: any }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: params.senderId,
      recipient_id: params.recipientId,
      order_id: params.orderId || null,
      message: params.message,
      is_admin: params.isAdmin || false,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get messages for a specific order
 */
export async function getMessagesByOrder(orderId: string): Promise<{ data: Message[] | null; error: any }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  return { data, error };
}

/**
 * Get all messages for a user (sent or received)
 */
export async function getUserMessages(userId: string): Promise<{ data: Message[] | null; error: any }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(userId: string): Promise<{ count: number; error: any }> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .is('read_at', null);

  return { count: count || 0, error };
}

/**
 * Mark a message as read
 */
export async function markAsRead(messageId: string): Promise<{ error: any }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  return { error };
}

/**
 * Mark all messages in an order as read for a user
 */
export async function markOrderMessagesAsRead(orderId: string, userId: string): Promise<{ error: any }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('order_id', orderId)
    .eq('recipient_id', userId)
    .is('read_at', null);

  return { error };
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

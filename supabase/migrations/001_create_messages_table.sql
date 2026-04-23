-- Migration: Create messages table for user-admin communication
-- Date: 2026-04-16
-- Description: Enables real-time messaging between customers and admin for order-related queries

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_order ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, read_at) 
  WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  USING (
    auth.uid()::text = sender_id 
    OR auth.uid()::text = recipient_id
  );

-- RLS Policy: Users can insert messages they send
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = sender_id
  );

-- RLS Policy: Users can update their own messages (for marking as read)
CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  USING (
    auth.uid()::text = recipient_id
  );

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Comment for documentation
COMMENT ON TABLE messages IS 'User-admin messaging system for order-related communication';
COMMENT ON COLUMN messages.sender_id IS 'User ID of the message sender';
COMMENT ON COLUMN messages.recipient_id IS 'User ID of the message recipient';
COMMENT ON COLUMN messages.order_id IS 'Related order ID (optional for general messages)';
COMMENT ON COLUMN messages.is_admin IS 'True if sender is an admin';
COMMENT ON COLUMN messages.read_at IS 'Timestamp when message was read (NULL if unread)';

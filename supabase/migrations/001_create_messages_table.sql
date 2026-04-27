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

-- NOTE: This app uses better-auth (not Supabase Auth).
-- RLS policies below are permissive because all data access is gated
-- through authenticated Next.js API routes that verify sessions server-side.
-- Do NOT use auth.uid() here — it will always be NULL with better-auth.

-- RLS Policy: Allow all selects (API route validates auth)
CREATE POLICY "Allow select via API"
  ON messages
  FOR SELECT
  USING (true);

-- RLS Policy: Allow all inserts (API route validates auth)
CREATE POLICY "Allow insert via API"
  ON messages
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow all updates (API route validates auth)
CREATE POLICY "Allow update via API"
  ON messages
  FOR UPDATE
  USING (true);

-- Enable realtime for messages table (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
END
$$;

-- Comment for documentation
COMMENT ON TABLE messages IS 'User-admin messaging system for order-related communication';
COMMENT ON COLUMN messages.sender_id IS 'User ID of the message sender';
COMMENT ON COLUMN messages.recipient_id IS 'User ID of the message recipient';
COMMENT ON COLUMN messages.order_id IS 'Related order ID (optional for general messages)';
COMMENT ON COLUMN messages.is_admin IS 'True if sender is an admin';
COMMENT ON COLUMN messages.read_at IS 'Timestamp when message was read (NULL if unread)';

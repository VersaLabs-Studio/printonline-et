-- Fix SQL for messages table (run this in Supabase SQL Editor)
-- This fixes the RLS policies for better-auth compatibility
-- and handles the already-existing realtime publication gracefully

-- Drop old broken policies (from previous migration attempt)
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

-- Create new permissive policies (access gated by authenticated API routes)
CREATE POLICY "Allow select via API"
  ON messages
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert via API"
  ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update via API"
  ON messages
  FOR UPDATE
  USING (true);

-- Verify realtime is enabled (idempotent — safe to run even if already enabled)
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

-- Verification queries
SELECT tablename, pubname 
FROM pg_publication_tables 
WHERE tablename = 'messages';

SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'messages';

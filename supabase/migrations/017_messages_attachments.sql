-- Migration: Add attachments support to messages table
-- Date: 2026-04-27
-- Description: Enables file uploads (images, videos, documents) in order messaging

-- Add attachments column (JSONB array of file metadata)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- Add index for efficient filtering of messages with attachments
CREATE INDEX IF NOT EXISTS idx_messages_has_attachments 
ON messages((jsonb_array_length(attachments)))
WHERE jsonb_array_length(attachments) > 0;

-- Comment for documentation
COMMENT ON COLUMN messages.attachments IS 'Array of uploaded file objects: {url, name, type, size}';

-- Migration: Create message-attachments storage bucket
-- Date: 2026-04-27
-- Description: Storage bucket for message file uploads (images, videos, documents)

-- Insert bucket (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments',
  'message-attachments',
  true,
  26214400, -- 25 MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
    'application/zip',
    'application/postscript'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
    'application/zip',
    'application/postscript'
  ];

-- RLS Policy: Allow anyone to read (public bucket)
CREATE POLICY "Allow public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'message-attachments');

-- RLS Policy: Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'message-attachments');

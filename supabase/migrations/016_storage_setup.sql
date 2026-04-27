-- PrintOnline.et v3.0 — Migration 011: Storage Setup & Policies
-- Creates the design-assets bucket and sets up RLS policies for file uploads.

-- 1. Create the bucket if it doesn't exist
-- Using SQL because buckets are stored in the storage.buckets table
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-assets', 'design-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects (if not already enabled)
-- Supabase enables this by default, but it's good practice to ensure it
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for the design-assets bucket

-- Policy: Anyone can upload (anon and authenticated)
-- This allows customers to upload their designs during checkout
CREATE POLICY "Anyone can upload design assets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'design-assets');

-- Policy: Anyone can view design assets
-- This allows customers and admins to see/download the uploaded files
CREATE POLICY "Anyone can view design assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'design-assets');

-- Policy: Service role has full access (already true by default in Supabase, but explicit for clarity)
-- Note: Service role bypasses RLS, so no policy strictly needed for it.

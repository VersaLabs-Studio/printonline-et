-- Migration 024: category_images table for multi-image support
-- Creates a dedicated table similar to product_images

CREATE TABLE category_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_category_images_category ON category_images(category_id);
CREATE INDEX idx_category_images_order ON category_images(category_id, display_order);

ALTER TABLE category_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read category_images" ON category_images
  FOR SELECT USING (true);
CREATE POLICY "Service role manages category_images" ON category_images
  FOR ALL USING (true) WITH CHECK (true);

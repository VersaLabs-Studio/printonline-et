-- PrintOnline.et v3.0 — Migration 012: Robust Design Assets & Preferences
-- Adds dedicated column for design preference and a table for multiple file attachments.

-- 1. Add design_preference to order_items
ALTER TABLE order_items ADD COLUMN design_preference TEXT DEFAULT 'upload'; 
-- Values: 'upload', 'hire_designer'

-- 2. Create table for multiple design assets
CREATE TABLE order_item_design_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add indexes for performance
CREATE INDEX idx_order_item_assets_item ON order_item_design_assets(order_item_id);

-- 4. Enable RLS
ALTER TABLE order_item_design_assets ENABLE ROW LEVEL SECURITY;

-- 5. Public read for design assets (needed for customer views)
CREATE POLICY "Public read order item design assets"
ON order_item_design_assets FOR SELECT
TO public
USING (true);

-- 6. Service role full access
CREATE POLICY "Service role manages design assets"
ON order_item_design_assets FOR ALL
TO public
USING (true)
WITH CHECK (true);

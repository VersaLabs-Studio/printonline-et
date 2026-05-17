-- Migration 030: Add homepage visibility control to categories
-- Adds show_on_homepage and homepage_display_order columns to the existing categories table

-- Add columns
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS homepage_display_order INTEGER DEFAULT 0;

-- Create index for fast homepage queries
CREATE INDEX IF NOT EXISTS idx_categories_homepage
  ON categories(show_on_homepage, homepage_display_order)
  WHERE show_on_homepage = true;

-- Seed: set all existing categories to show on homepage, preserving current display_order
UPDATE categories
SET show_on_homepage = true,
    homepage_display_order = COALESCE(display_order, 0)
WHERE show_on_homepage IS NULL;

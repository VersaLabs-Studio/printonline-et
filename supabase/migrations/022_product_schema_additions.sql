-- PrintOnline.et v3.6 — Migration 022: Product Schema Additions
-- Adds overview, rush eligibility, and quantity thresholds to products

ALTER TABLE products ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rush_eligible BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_thresholds JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.overview IS 'Rich text product overview shown on detail page';
COMMENT ON COLUMN products.rush_eligible IS 'Whether this product supports rush production';
COMMENT ON COLUMN products.quantity_thresholds IS 'Quantity-based pricing tiers as JSON array';

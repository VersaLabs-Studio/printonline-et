ALTER TABLE products ADD COLUMN IF NOT EXISTS manual_quantity_entry BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_interval INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_presets JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.manual_quantity_entry IS 'Allow customers to type a custom quantity instead of dropdown presets';
COMMENT ON COLUMN products.quantity_interval IS 'Increment interval for quantity (e.g., 5 for steps of 5: 5, 10, 15...)';
COMMENT ON COLUMN products.quantity_presets IS 'Custom quantity preset values for dropdown (e.g., [50, 100, 250, 500, 1000])';

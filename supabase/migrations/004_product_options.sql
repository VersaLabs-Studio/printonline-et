-- PrintOnline.et v2.0 — Migration 004: Product Options & Option Values
-- Schema-driven product configuration system
-- Options = configurable fields (Size, Paper, Lamination)
-- Values  = selectable choices per option (A4, A5, Matte, Glossy)

CREATE TABLE product_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,                         -- 'size', 'paper_thickness', 'lamination'
  option_label TEXT NOT NULL,                       -- 'Size', 'Paper Thickness', 'Lamination'
  field_type TEXT NOT NULL DEFAULT 'select',         -- select, radio, checkbox, multi-select, modal-link
  is_required BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  description TEXT,
  group_label TEXT,                                  -- For grouping options in the form UI
  depends_on_option TEXT,                           -- Key of option this depends on
  depends_on_value TEXT,                            -- Value that activates this option
  UNIQUE(product_id, option_key)
);

CREATE TABLE product_option_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
  value TEXT NOT NULL,                              -- 'a4', '300gsm', 'matte'
  label TEXT NOT NULL,                              -- 'A4 (29.7cm x 21cm)', '300gsm', 'Matte'
  price_amount DECIMAL(12,2),                       -- Price for this specific combination (ETB)
  price_type TEXT DEFAULT 'fixed',                   -- fixed, percentage, multiplier, override
  group_name TEXT,                                  -- For grouped select dropdowns
  description TEXT,                                 -- Extra info shown in UI
  display_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,                 -- Pre-selected by default
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb                -- Flexible extra data (hex colors, specs, etc.)
);

-- Indexes
CREATE INDEX idx_product_options_product ON product_options(product_id);
CREATE INDEX idx_product_options_key ON product_options(product_id, option_key);
CREATE INDEX idx_option_values_option ON product_option_values(option_id);
CREATE INDEX idx_option_values_active ON product_option_values(is_active) WHERE is_active = true;

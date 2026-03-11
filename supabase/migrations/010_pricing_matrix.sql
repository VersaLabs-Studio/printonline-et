-- PrintOnline.et v3.0 — Migration 010: Product Pricing Matrix
-- Replaces additive pricing with exact matrix-based price lookups
-- Each row represents the final unit price for a specific combination of options
-- ============================================================
CREATE TABLE product_pricing_matrix (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    matrix_key TEXT NOT NULL,
    -- e.g. "front_only|250gsm|none" — pipe-delimited option values
    matrix_label TEXT,
    -- Human-readable label e.g. "1 Side Print, 250gsm, No Lamination"
    price DECIMAL(12, 2) NOT NULL,
    -- The exact final unit price in ETB
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, matrix_key)
);
CREATE INDEX idx_pricing_matrix_product ON product_pricing_matrix(product_id);
CREATE INDEX idx_pricing_matrix_lookup ON product_pricing_matrix(product_id, matrix_key)
WHERE is_active = true;
-- Enable RLS
ALTER TABLE product_pricing_matrix ENABLE ROW LEVEL SECURITY;
-- Public read for pricing data (customers need to see prices)
CREATE POLICY "Public read pricing_matrix" ON product_pricing_matrix FOR
SELECT USING (is_active = true);
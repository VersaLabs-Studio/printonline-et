-- PrintOnline.et v3.6 — Migration 021: Designer Fee Tiers
-- Replaces flat hire_designer_fee with quantity-based tiered pricing

CREATE TABLE designer_fee_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    fee_amount DECIMAL(12,2) NOT NULL,
    label TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, min_quantity)
);

CREATE INDEX idx_designer_fee_tiers_product ON designer_fee_tiers(product_id);
CREATE INDEX idx_designer_fee_tiers_active ON designer_fee_tiers(is_active) WHERE is_active = true;

ALTER TABLE designer_fee_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read designer_fee_tiers" ON designer_fee_tiers
    FOR SELECT USING (is_active = true);
CREATE POLICY "Service role manages designer_fee_tiers" ON designer_fee_tiers
    FOR ALL USING (true) WITH CHECK (true);

-- PrintOnline.et v3.6 — Migration 020: Delivery Zones
-- Replaces hardcoded zones in lib/delivery/zones.ts with DB-backed configuration

CREATE TABLE delivery_zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sub_city TEXT NOT NULL UNIQUE,
    base_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    description TEXT,
    zone_label TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_quantity_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zone_id UUID REFERENCES delivery_zones(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    label TEXT,
    display_order INTEGER DEFAULT 0,
    UNIQUE(zone_id, min_quantity)
);

CREATE INDEX idx_delivery_zones_active ON delivery_zones(is_active) WHERE is_active = true;
CREATE INDEX idx_delivery_qty_tiers_zone ON delivery_quantity_tiers(zone_id);

ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_quantity_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read delivery_zones" ON delivery_zones
    FOR SELECT USING (is_active = true);
CREATE POLICY "Service role manages delivery_zones" ON delivery_zones
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read delivery_quantity_tiers" ON delivery_quantity_tiers
    FOR SELECT USING (true);
CREATE POLICY "Service role manages delivery_quantity_tiers" ON delivery_quantity_tiers
    FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_delivery_zones_timestamp
    BEFORE UPDATE ON delivery_zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

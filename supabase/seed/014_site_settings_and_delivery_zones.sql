-- PrintOnline.et v3.6 — Seed 014: Site Settings & Delivery Zones
-- Populates site_settings with default config and delivery_zones with Addis Ababa sub-cities

-- Site Settings
INSERT INTO site_settings (setting_key, setting_value, label, description, category, data_type)
VALUES
    ('rush_fee_amount', '500', 'Rush Production Fee (ETB)', 'Additional fee for rush/expedited production orders', 'pricing', 'number'),
    ('free_delivery_threshold', '5000', 'Free Delivery Threshold (ETB)', 'Minimum order amount for free delivery', 'delivery', 'number'),
    ('pickup_fee', '0', 'Pickup Fee (ETB)', 'Fee for customer self-pickup', 'delivery', 'number'),
    ('site_name', '"PrintOnline.et"', 'Site Name', 'Displayed site name across the storefront', 'general', 'text'),
    ('currency', '"ETB"', 'Default Currency', 'Default currency for pricing display', 'general', 'text')
ON CONFLICT (setting_key) DO NOTHING;

-- Delivery Zones (Addis Ababa sub-cities)
INSERT INTO delivery_zones (sub_city, base_fee, description, zone_label, display_order)
VALUES
    ('Bole', 200, 'Standard delivery - HQ area', 'Zone 1', 1),
    ('Kirkos', 240, 'Near zone delivery', 'Zone 2', 2),
    ('Arada', 240, 'Near zone delivery', 'Zone 2', 3),
    ('Addis Ketema', 280, 'Medium zone delivery', 'Zone 3', 4),
    ('Gulele', 280, 'Medium zone delivery', 'Zone 3', 5),
    ('Yeka', 280, 'Medium zone delivery', 'Zone 3', 6),
    ('Kolfe Keranio', 320, 'Far zone delivery', 'Zone 4', 7),
    ('Nifas Silk', 320, 'Far zone delivery', 'Zone 4', 8),
    ('Akaki', 400, 'Industrial zone delivery', 'Zone 5', 9),
    ('Lemi Kura', 400, 'Outer zone delivery', 'Zone 5', 10)
ON CONFLICT (sub_city) DO NOTHING;

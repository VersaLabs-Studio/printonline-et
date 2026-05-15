CREATE TABLE IF NOT EXISTS homepage_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  badge_text TEXT,
  badge_color TEXT DEFAULT 'red',
  link_url TEXT,
  link_text TEXT DEFAULT 'View Offer',
  countdown_label TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_deals_active ON homepage_deals(is_active, display_order)
  WHERE is_active = true;

ALTER TABLE homepage_deals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read homepage_deals" ON homepage_deals
    FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role manages homepage_deals" ON homepage_deals
    FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_homepage_deals_timestamp
    BEFORE UPDATE ON homepage_deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed: 3 default deals (matching current hardcoded data)
INSERT INTO homepage_deals (title, subtitle, description, badge_text, badge_color, link_url, countdown_label, display_order) VALUES
  ('Flash Sale', 'Business Cards', 'Premium business cards at unbeatable prices', '2 days left', 'red', '/products/premium-business-cards', 'Special Offer', 1),
  ('Bundle Deal', 'Complete Branding', 'Get everything you need for your brand identity', '5 days left', 'blue', '/digital-paper-prints', 'Special Offer', 2),
  ('Limited Time', 'Banner Printing', 'High-quality banners for events and promotions', '1 week left', 'green', '/flex-banners', 'Special Offer', 3)
ON CONFLICT (id) DO NOTHING;

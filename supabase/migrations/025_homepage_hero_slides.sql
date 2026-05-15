CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Order Now',
  cta_link TEXT DEFAULT '/all-products',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active, display_order)
  WHERE is_active = true;

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read hero_slides" ON hero_slides
    FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role manages hero_slides" ON hero_slides
    FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_hero_slides_timestamp
    BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed: 3 default slides (matching current hardcoded data)
INSERT INTO hero_slides (title, subtitle, image_url, display_order) VALUES
  ('Professional Printing Solutions', 'Premium quality printing services for your business needs', '/sample1.jpg', 1),
  ('Custom Branding Materials', 'Stand out with custom designs and professional branding', '/sample2.jpg', 2),
  ('Premium Promotional Items', 'Boost your brand visibility with high-quality promotional products', '/sample3.jpg', 3)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS homepage_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  quote TEXT NOT NULL,
  project TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_testimonials_active ON homepage_testimonials(is_active, display_order)
  WHERE is_active = true;

ALTER TABLE homepage_testimonials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read homepage_testimonials" ON homepage_testimonials
    FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role manages homepage_testimonials" ON homepage_testimonials
    FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_homepage_testimonials_timestamp
    BEFORE UPDATE ON homepage_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed: 3 default testimonials (matching current hardcoded data)
INSERT INTO homepage_testimonials (name, role, company, avatar_url, rating, quote, project, display_order) VALUES
  ('Sarah Johnson', 'Marketing Director', 'TechCorp', '/avatars/sarah.jpg', 5, 'PrintOnline.et transformed our marketing materials. The quality exceeded our expectations and the turnaround was incredible!', 'Business Cards & Brochures', 1),
  ('Michael Chen', 'CEO', 'StartupHub', '/avatars/michael.jpg', 5, 'From concept to delivery, the team at PrintOnline.et nailed our brand identity. Highly recommend for any startup looking to make an impression.', 'Event Branding Package', 2),
  ('Emily Rodriguez', 'Operations Manager', 'RetailCo', '/avatars/emily.jpg', 5, 'The vehicle wraps turned heads everywhere. Professional service, premium quality, and great value. Our fleet has never looked better.', 'Vehicle Wraps', 3)
ON CONFLICT (id) DO NOTHING;

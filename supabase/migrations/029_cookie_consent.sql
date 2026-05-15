CREATE TABLE IF NOT EXISTS privacy_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  policy_type TEXT NOT NULL DEFAULT 'privacy',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_privacy_policies_type ON privacy_policies(policy_type)
  WHERE is_active = true;

ALTER TABLE privacy_policies ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read privacy_policies" ON privacy_policies
    FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role manages privacy_policies" ON privacy_policies
    FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_privacy_policies_timestamp
    BEFORE UPDATE ON privacy_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed: default privacy, terms, and cookie policy
INSERT INTO privacy_policies (title, content, policy_type, version) VALUES
(
  'Privacy Policy - PrintOnline.et',
  E'## Privacy Policy\n\nLast updated: May 2026\n\n### Information We Collect\n\nWe collect information you provide directly to us, including:\n- Name and contact information\n- Billing and shipping addresses\n- Payment information (processed securely through third-party providers)\n- Order history and preferences\n\n### How We Use Your Information\n\nWe use the information we collect to:\n- Process and fulfill your orders\n- Communicate with you about your orders\n- Send marketing communications (with your consent)\n- Improve our products and services\n- Comply with legal obligations\n\n### Data Protection\n\nWe implement appropriate security measures to protect your personal information. Your data is stored securely and only accessible to authorized personnel.\n\n### Your Rights\n\nYou have the right to:\n- Access your personal data\n- Correct inaccurate data\n- Delete your account and associated data\n- Opt out of marketing communications\n- Export your data\n\n### Contact Us\n\nFor privacy-related inquiries, contact us at:\n- Email: panapromotionplc@gmail.com\n- Address: Hayahulet Rd., Addis Ababa, Ethiopia',
  'privacy', 1
),
(
  'Terms of Service - PrintOnline.et',
  E'## Terms of Service\n\nLast updated: May 2026\n\n### Acceptance of Terms\n\nBy using PrintOnline.et, you agree to these terms of service. If you do not agree, please do not use our services.\n\n### Orders and Payments\n\n- All prices are in ETB (Ethiopian Birr) unless stated otherwise\n- Payment is required before production begins\n- We accept mobile money, bank transfer, and cash on delivery\n- Orders are subject to availability and acceptance\n\n### Production and Delivery\n\n- Standard production: 2-4 business days\n- Rush production: 1-2 business days (additional fee applies)\n- Delivery times vary by location\n- We are not responsible for delays caused by third-party services\n\n### Returns and Refunds\n\n- Defective or incorrect items may be returned within 7 days\n- Custom/personalized items are non-returnable unless defective\n- Refunds are processed within 5-10 business days\n\n### Intellectual Property\n\n- Designs created by PrintOnline.et remain our intellectual property\n- Customer-provided designs are used only for the ordered products\n- Unauthorized reproduction of our designs is prohibited',
  'terms', 1
),
(
  'Cookie Policy - PrintOnline.et',
  E'## Cookie Policy\n\nLast updated: May 2026\n\n### What Are Cookies\n\nCookies are small text files stored on your device when you visit a website. They help us provide a better browsing experience.\n\n### How We Use Cookies\n\nWe use cookies for:\n- **Essential cookies**: Required for the website to function (cart, authentication)\n- **Analytics cookies**: Help us understand how visitors use our site\n- **Preference cookies**: Remember your settings and preferences\n\n### Types of Cookies We Use\n\n| Type | Purpose | Duration |\n|------|---------|----------|\n| Session cookies | Maintain your session while browsing | Session |\n| Cart cookies | Remember items in your shopping cart | 30 days |\n| Authentication cookies | Keep you logged in | 7 days |\n| Preference cookies | Remember your display preferences | 1 year |\n\n### Managing Cookies\n\nYou can control cookies through your browser settings. Disabling certain cookies may affect website functionality.\n\n### Third-Party Cookies\n\nWe do not use third-party tracking cookies. Analytics are collected using privacy-friendly methods.\n\n### Contact\n\nFor questions about our cookie policy, contact us at panapromotionplc@gmail.com',
  'cookie', 1
)
ON CONFLICT (id) DO NOTHING;

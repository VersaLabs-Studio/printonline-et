-- PrintOnline.et v3.6 — Migration 019: Site Settings
-- Centralized key-value settings for site-wide configuration

CREATE TABLE site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    data_type TEXT NOT NULL DEFAULT 'number',
    updated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages site_settings" ON site_settings 
    FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_site_settings_timestamp
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
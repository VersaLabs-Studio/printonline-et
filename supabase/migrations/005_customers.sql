-- PrintOnline.et v2.0 — Migration 005: Customer Profiles
-- Extended user profiles linked to better-auth users
-- Stores Ethiopian-specific fields (TIN, sub-city, woreda)

CREATE TABLE customer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id TEXT NOT NULL UNIQUE,                -- better-auth user ID
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tin_number TEXT,                                   -- Ethiopian Tax Identification Number
  company_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT DEFAULT 'Addis Ababa',
  sub_city TEXT,                                     -- Addis Ababa sub-cities
  woreda TEXT,                                       -- Ethiopian administrative division
  country TEXT DEFAULT 'Ethiopia',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customers_auth ON customer_profiles(auth_user_id);
CREATE INDEX idx_customers_email ON customer_profiles(email);
CREATE INDEX idx_customers_active ON customer_profiles(is_active) WHERE is_active = true;

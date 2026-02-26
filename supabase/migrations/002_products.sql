-- PrintOnline.et v2.0 — Migration 002: Products
-- Core product table with ETB pricing, stock management, and full-text search

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ETB',
  sku TEXT UNIQUE,
  badge TEXT,                                      -- 'Best Seller', 'New', 'Premium'
  form_type TEXT NOT NULL DEFAULT 'paper',          -- paper, large-format, apparel, gift, board
  is_active BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  stock_status TEXT NOT NULL DEFAULT 'in_stock',    -- in_stock, low_stock, out_of_stock, made_to_order
  min_order_quantity INTEGER DEFAULT 1,
  features JSONB DEFAULT '[]'::jsonb,               -- ["Premium Quality", "Fast Delivery"]
  specifications JSONB DEFAULT '[]'::jsonb,          -- [{"label": "Material", "value": "300gsm"}]
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_stock ON products(stock_status);
CREATE INDEX idx_products_display_order ON products(display_order);
CREATE INDEX idx_products_form_type ON products(form_type);

-- Full-text search index for global search
CREATE INDEX idx_products_search ON products
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, '')));

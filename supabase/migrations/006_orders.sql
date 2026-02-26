-- PrintOnline.et v2.0 — Migration 006: Orders & Order Items
-- Full order lifecycle with status tracking, ETB financials, and auto-generated order numbers

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,                 -- POL-2026-00001 format (auto-generated)
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE SET NULL,
  
  -- Status workflow: pending → confirmed → processing → ready → delivered → completed | cancelled
  status TEXT NOT NULL DEFAULT 'pending',
  status_history JSONB DEFAULT '[]'::jsonb,          -- [{status, timestamp, by, note}]
  
  -- Financials (ETB)
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  delivery_fee DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ETB',
  
  -- Customer info snapshot (at time of order)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_tin TEXT,
  
  -- Delivery
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_sub_city TEXT,
  
  -- Notes
  special_instructions TEXT,                         -- Customer notes
  internal_notes TEXT,                               -- Admin-only notes
  
  -- Terms & Conditions
  terms_accepted BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,
  
  -- Email tracking
  confirmation_email_sent BOOLEAN DEFAULT false,
  
  -- Payment (future: gateway integration)
  payment_method TEXT,                               -- telebirr, cbe_birr, bank_transfer, etc.
  payment_status TEXT DEFAULT 'pending',              -- pending, paid, failed, refunded
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  -- Product snapshot (prices at time of order — never changes)
  product_name TEXT NOT NULL,
  product_slug TEXT,
  product_image TEXT,
  category TEXT,
  unit_price DECIMAL(12,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total DECIMAL(12,2) NOT NULL,
  
  -- Selected configuration options (snapshot)
  selected_options JSONB DEFAULT '{}'::jsonb,
  -- e.g. {"size": "A4", "paper_thickness": "300gsm", "lamination": "matte", "print_sides": "both"}
  
  -- Design file attachment
  design_file_url TEXT,
  design_file_name TEXT,
  design_file_size INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Auto-incrementing order number sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger to auto-generate order numbers: POL-YYYY-NNNNN
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'POL-' || TO_CHAR(NOW(), 'YYYY') || '-'
    || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- 011_chapa_payment_updates.sql

-- Add Chapa payment fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tx_ref TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'chapa',
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ;

-- Recreate generate_order_number trigger to include the Chapa timestamp tx_ref logic
-- Or keep tx_ref separate and generated from API. It's better to manage tx_ref generation
-- in code (e.g., POL-CHAPA-{order_id}-{timestamp}).

-- Create index for tx_ref since we'll query it during verifications
CREATE INDEX IF NOT EXISTS idx_orders_tx_ref ON orders(tx_ref);

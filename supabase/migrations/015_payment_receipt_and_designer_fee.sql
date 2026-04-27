-- Migration: Add payment receipt and designer fee fields
-- Date: 2026-04-22
-- Description: Adds payment_receipt JSONB column to orders and hire_designer_fee to products

-- Add payment receipt column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_receipt JSONB;

COMMENT ON COLUMN orders.payment_receipt IS 
'Stores Chapa payment verification response data for receipt display';

-- Add designer fee column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS hire_designer_fee NUMERIC DEFAULT 0;

COMMENT ON COLUMN products.hire_designer_fee IS 
'Fee charged when customer selects "Hire a Designer" service for this product';

-- Add index for payment receipt queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_receipt 
ON orders USING gin (payment_receipt) 
WHERE payment_receipt IS NOT NULL;

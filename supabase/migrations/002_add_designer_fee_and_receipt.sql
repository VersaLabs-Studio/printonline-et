-- Migration: Add designer fee and payment receipt fields
-- Date: 2026-04-22
-- Description: Adds hire_designer_fee to products and payment_receipt to orders

-- Add designer fee to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS hire_designer_fee NUMERIC(10,2) DEFAULT 0;

COMMENT ON COLUMN products.hire_designer_fee IS 
'Fee charged when customer selects "Hire a Designer" service';

-- Add payment receipt to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_receipt JSONB;

COMMENT ON COLUMN orders.payment_receipt IS 
'Stores Chapa payment verification response data for receipt display';

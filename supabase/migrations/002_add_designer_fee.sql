-- Migration: Add designer fee to products table
-- Date: 2026-04-16
-- Description: Adds configurable designer fee per product for CMS

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS hire_designer_fee NUMERIC DEFAULT 0;

COMMENT ON COLUMN products.hire_designer_fee IS 
'Fee charged when customer selects "Hire a Designer" service for this product';

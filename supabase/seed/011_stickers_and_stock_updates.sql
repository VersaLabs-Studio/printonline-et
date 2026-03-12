-- PrintOnline.et v3.0 — Refined Sticker Matrix & Out of Stock Booklets
-- format: sorted_option_key1:value1|sorted_option_key2:value2
-- ============================================================

-- Step 1: Cleanup Paper Sticker Sheets
DELETE FROM product_pricing_matrix WHERE product_id = (SELECT id FROM products WHERE slug = 'paper-sticker-sheets');

-- Step 2: Insert corrected matrix
-- Keys: lamination, size (Alphabetical order)
INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  -- A4
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:none|size:a4', 50.00, 'A4, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:matte|size:a4', 60.00, 'A4, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:glossy|size:a4', 60.00, 'A4, Glossy Lamination'),

  -- A5
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:none|size:a5', 25.00, 'A5, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:matte|size:a5', 30.00, 'A5, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:glossy|size:a5', 30.00, 'A5, Glossy Lamination'),

  -- A6
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:none|size:a6', 13.00, 'A6, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:matte|size:a6', 15.00, 'A6, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'paper-sticker-sheets'), 'lamination:glossy|size:a6', 15.00, 'A6, Glossy Lamination');

-- Step 3: Cleanup old prices in option values
UPDATE product_option_values 
SET price_amount = NULL, price_type = 'fixed'
WHERE option_id IN (
    SELECT id FROM product_options 
    WHERE product_id = (SELECT id FROM products WHERE slug = 'paper-sticker-sheets')
);

-- Step 4: Mark specific booklet products as out of stock
UPDATE products 
SET stock_status = 'out_of_stock'
WHERE slug IN (
    'wire-bound-booklets',
    'perfect-bound-booklets',
    'saddle-stitched-booklets'
);

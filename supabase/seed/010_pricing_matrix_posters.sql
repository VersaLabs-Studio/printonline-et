-- PrintOnline.et v3.0 — Refined Poster Options & Matrix
-- format: sorted_option_key1:value1|sorted_option_key2:value2
-- ============================================================

-- Step 1: Cleanup Posters
DELETE FROM product_pricing_matrix WHERE product_id = (SELECT id FROM products WHERE slug = 'posters');

-- Step 2: Insert corrected matrix
-- Keys: lamination, paper_thickness (Alphabetical order)
INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  -- 150gsm
  ((SELECT id FROM products WHERE slug = 'posters'), 'lamination:none|paper_thickness:150gsm', 54.00, '150gsm, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'posters'), 'lamination:matte|paper_thickness:150gsm', 70.00, '150gsm, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'posters'), 'lamination:glossy|paper_thickness:150gsm', 70.00, '150gsm, Glossy Lamination'),

  -- 250gsm
  ((SELECT id FROM products WHERE slug = 'posters'), 'lamination:none|paper_thickness:250gsm', 70.00, '250gsm, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'posters'), 'lamination:matte|paper_thickness:250gsm', 90.00, '250gsm, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'posters'), 'lamination:glossy|paper_thickness:250gsm', 90.00, '250gsm, Glossy Lamination');

-- Step 3: Cleanup old prices in option values
UPDATE product_option_values 
SET price_amount = NULL, price_type = 'fixed'
WHERE option_id IN (
    SELECT id FROM product_options 
    WHERE product_id = (SELECT id FROM products WHERE slug = 'posters')
);

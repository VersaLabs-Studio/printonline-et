-- PrintOnline.et v3.0 — Refined Bookmarks Options & Matrix
-- format: sorted_option_key1:value1|sorted_option_key2:value2
-- ============================================================

-- Step 1: Cleanup Bookmarks
DELETE FROM product_pricing_matrix WHERE product_id = (SELECT id FROM products WHERE slug = 'bookmarks');

-- Set min_order_quantity to 50
UPDATE products SET min_order_quantity = 50 WHERE slug = 'bookmarks';

-- Step 2: Insert corrected matrix
-- Keys: lamination, print_sides (Alphabetical order)
INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  -- 1 Side Print
  ((SELECT id FROM products WHERE slug = 'bookmarks'), 'lamination:none|print_sides:front_only', 10.00, '1 Side, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'bookmarks'), 'lamination:matte|print_sides:front_only', 12.00, '1 Side, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'bookmarks'), 'lamination:glossy|print_sides:front_only', 12.00, '1 Side, Glossy Lamination'),

  -- 2 Side Print
  ((SELECT id FROM products WHERE slug = 'bookmarks'), 'lamination:none|print_sides:both_sides', 20.00, '2 Sides, No Lamination'),
  ((SELECT id FROM products WHERE slug = 'bookmarks'), 'lamination:matte|print_sides:both_sides', 24.00, '2 Sides, Matte Lamination'),
  ((SELECT id FROM products WHERE slug = 'bookmarks'), 'lamination:glossy|print_sides:both_sides', 24.00, '2 Sides, Glossy Lamination');

-- Step 3: Cleanup old prices in option values
UPDATE product_option_values 
SET price_amount = NULL, price_type = 'fixed'
WHERE option_id IN (
    SELECT id FROM product_options 
    WHERE product_id = (SELECT id FROM products WHERE slug = 'bookmarks')
);

-- PrintOnline.et v3.0 — Refined Folders Options & Matrix
-- format: sorted_option_key1:value1|sorted_option_key2:value2
-- ============================================================

-- Step 1: Cleanup Folders
DELETE FROM product_pricing_matrix WHERE product_id = (SELECT id FROM products WHERE slug = 'folders');

-- Set min_order_quantity to 50
UPDATE products SET min_order_quantity = 50 WHERE slug = 'folders';

-- Step 2: Insert corrected matrix
-- Keys: pocket, print_sides (Alphabetical order)
-- Note: Lamination is a required option but does not affect price, so we exclude it from the matrix key drivers.
INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  -- Front Only
  ((SELECT id FROM products WHERE slug = 'folders'), 'pocket:right_side|print_sides:front_only', 350.00, 'Front Only, 1 Pocket'),
  ((SELECT id FROM products WHERE slug = 'folders'), 'pocket:left_right|print_sides:front_only', 380.00, 'Front Only, 2 Pockets'),

  -- Both Sides
  ((SELECT id FROM products WHERE slug = 'folders'), 'pocket:right_side|print_sides:both_sides', 400.00, 'Both Side Print, 1 Pocket'),
  ((SELECT id FROM products WHERE slug = 'folders'), 'pocket:left_right|print_sides:both_sides', 450.00, 'Both Side Print, 2 Pockets');

-- Step 3: Cleanup old override prices in option values to prevent fallback interference
UPDATE product_option_values 
SET price_amount = NULL, price_type = 'fixed'
WHERE option_id IN (
    SELECT id FROM product_options 
    WHERE product_id = (SELECT id FROM products WHERE slug = 'folders')
);

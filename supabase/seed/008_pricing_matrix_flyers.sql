-- PrintOnline.et v3.0 — Refined Flyer Options & Matrix
-- format: sorted_option_key1:value1|sorted_option_key2:value2
-- ============================================================

-- Step 1: Cleanup Flyers
DELETE FROM product_pricing_matrix WHERE product_id = (SELECT id FROM products WHERE slug = 'flyers');

-- Revert/Ensure Paper Thickness values are 80gsm and 150gsm
DELETE FROM product_option_values 
WHERE option_id = (
    SELECT id FROM product_options 
    WHERE product_id = (SELECT id FROM products WHERE slug = 'flyers') 
      AND option_key = 'paper_thickness'
);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES 
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'flyers') AND option_key = 'paper_thickness'), '80gsm', '80gsm', 1, false),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'flyers') AND option_key = 'paper_thickness'), '150gsm', '150gsm', 2, true);

-- Ensure lamination is removed from flyers if it was added in previous steps incorrectly
DELETE FROM product_options 
WHERE product_id = (SELECT id FROM products WHERE slug = 'flyers') 
  AND option_key = 'lamination';

-- Ensure min_order_quantity is 50
UPDATE products SET min_order_quantity = 50 WHERE slug = 'flyers';

-- Step 2: Insert corrected matrix
-- Keys: paper_thickness, print_sides, size (Alphabetical order)
INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  -- 80gsm, Front Only
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:front_only|size:dl', 7.00, 'DL, 80gsm, Front Only'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:front_only|size:a6', 5.00, 'A6, 80gsm, Front Only'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:front_only|size:a5', 10.00, 'A5, 80gsm, Front Only'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:front_only|size:a4', 20.00, 'A4, 80gsm, Front Only'),

  -- 80gsm, Both Sides
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:both_sides|size:dl', 14.00, 'DL, 80gsm, Both Sides'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:both_sides|size:a6', 10.00, 'A6, 80gsm, Both Sides'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:both_sides|size:a5', 20.00, 'A5, 80gsm, Both Sides'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:80gsm|print_sides:both_sides|size:a4', 40.00, 'A4, 80gsm, Both Sides'),

  -- 150gsm, Front Only
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:front_only|size:dl', 9.00, 'DL, 150gsm, Front Only'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:front_only|size:a6', 7.00, 'A6, 150gsm, Front Only'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:front_only|size:a5', 14.00, 'A5, 150gsm, Front Only'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:front_only|size:a4', 28.00, 'A4, 150gsm, Front Only'),

  -- 150gsm, Both Sides
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:both_sides|size:dl', 18.00, 'DL, 150gsm, Both Sides'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:both_sides|size:a6', 14.00, 'A6, 150gsm, Both Sides'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:both_sides|size:a5', 28.00, 'A5, 150gsm, Both Sides'),
  ((SELECT id FROM products WHERE slug = 'flyers'), 'paper_thickness:150gsm|print_sides:both_sides|size:a4', 54.00, 'A4, 150gsm, Both Sides');

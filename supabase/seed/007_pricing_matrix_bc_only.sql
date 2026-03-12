-- PrintOnline.et v3.0 — Refined Business Card Matrix
-- format: sorted_option_key1:value1|sorted_option_key2:value2
-- This ensures that regardless of selection order, the match is found.

DELETE FROM product_pricing_matrix WHERE product_id = (SELECT id FROM products WHERE slug = 'business-cards');

INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  -- 1 Side Print
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:none|paper_thickness:250gsm|print_sides:front_only', 3.50, '1 Side, 250gsm, No Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:matte|paper_thickness:250gsm|print_sides:front_only', 4.50, '1 Side, 250gsm, Matte Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:glossy|paper_thickness:250gsm|print_sides:front_only', 4.50, '1 Side, 250gsm, Glossy Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:none|paper_thickness:300gsm|print_sides:front_only', 4.00, '1 Side, 300gsm, No Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:matte|paper_thickness:300gsm|print_sides:front_only', 5.00, '1 Side, 300gsm, Matte Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:glossy|paper_thickness:300gsm|print_sides:front_only', 5.00, '1 Side, 300gsm, Glossy Lam'),
  
  -- 2 Side Print
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:none|paper_thickness:250gsm|print_sides:both_sides', 7.00, '2 Side, 250gsm, No Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:matte|paper_thickness:250gsm|print_sides:both_sides', 9.00, '2 Side, 250gsm, Matte Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:glossy|paper_thickness:250gsm|print_sides:both_sides', 9.00, '2 Side, 250gsm, Glossy Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:none|paper_thickness:300gsm|print_sides:both_sides', 8.00, '2 Side, 300gsm, No Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:matte|paper_thickness:300gsm|print_sides:both_sides', 10.00, '2 Side, 300gsm, Matte Lam'),
  ((SELECT id FROM products WHERE slug = 'business-cards'), 'lamination:glossy|paper_thickness:300gsm|print_sides:both_sides', 10.00, '2 Side, 300gsm, Glossy Lam');

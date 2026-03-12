-- PrintOnline.et v3.0 — Spiral Notebooks (Refactored)
-- ============================================================

-- Step 1: Update Product Identity
UPDATE products 
SET 
  name = 'Spiral Notebooks',
  slug = 'spiral-notebooks',
  description = 'High-quality custom branded spiral notebooks available in A5 and A6 sizes. Perfect for corporate gifting, personal planning, or educational purposes. Features customizable sheet counts, page patterns, and premium laminated covers.',
  short_description = 'Custom branded spiral notebooks with A5/A6 size options and premium finishes.',
  specifications = '[{"label": "Sizes", "value": "A5 / A6"}, {"label": "Sheets", "value": "50 / 100"}, {"label": "Binding", "value": "Spiral (Wire-O) Binding"}, {"label": "Cover", "value": "Laminated 300gsm Paper"}]'::jsonb,
  features = '["Custom Branded Covers", "Matte or Glossy Lamination", "A5 & A6 Size Options", "50 or 100 Sheets", "Multiple Grid/Rulled Patterns"]'::jsonb,
  min_order_quantity = 50
WHERE slug IN ('notebooks', 'spiral-notebooks');

-- Step 2: Cleanup Old Options and Matrix
DELETE FROM product_pricing_matrix 
WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks');

DELETE FROM product_options 
WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks');

-- Step 3: Insert New Options
-- Size
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'size', 'Size', 'radio', true, 1);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES 
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'size'), 'a5', 'A5 (21cm x 14.85cm)', 1, true),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'size'), 'a6', 'A6 (14.85cm x 10.5cm)', 2, false);

-- Number of Sheets
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'sheets', 'Number of Sheets', 'radio', true, 2);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES 
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'sheets'), '50', '50 Sheets', 1, true),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'sheets'), '100', '100 Sheets', 2, false);

-- Inside Page Pattern
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'pattern', 'Inside Page Pattern', 'radio', true, 3);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES 
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'pattern'), 'blank', 'Blank', 1, false),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'pattern'), 'college_ruled', 'College Ruled', 2, true),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'pattern'), 'graph', 'Graph Paper', 3, false),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'pattern'), 'custom', 'Custom', 4, false);

-- Cover Paper Lamination
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'lamination', 'Cover Paper Lamination', 'radio', true, 4);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES 
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'lamination'), 'none', 'None', 1, false),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'lamination'), 'matte', 'Matte', 2, true),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'lamination'), 'glossy', 'Glossy', 3, false);

-- Binding Edge
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'binding_edge', 'Binding Edge', 'radio', true, 5);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES 
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'binding_edge'), 'left', 'Left Side', 1, true),
  ((SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug = 'spiral-notebooks') AND option_key = 'binding_edge'), 'top', 'Top', 2, false);

-- Step 5: Insert corrected matrix
-- Keys: sheets, size (Alphabetical order)
INSERT INTO product_pricing_matrix (product_id, matrix_key, price, matrix_label)
VALUES
  ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'sheets:50|size:a5', 470.00, 'A5, 50 Sheets'),
  ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'sheets:100|size:a5', 850.00, 'A5, 100 Sheets'),
  ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'sheets:50|size:a6', 250.00, 'A6, 50 Sheets'),
  ((SELECT id FROM products WHERE slug = 'spiral-notebooks'), 'sheets:100|size:a6', 450.00, 'A6, 100 Sheets');

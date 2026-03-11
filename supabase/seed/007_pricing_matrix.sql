-- PrintOnline.et v3.0 — Seed: Product Pricing Matrices
-- Run AFTER 010_pricing_matrix.sql migration
-- All prices in ETB (Ethiopian Birr) per unit
-- matrix_key format: option_value1|option_value2|option_value3 (pipe-delimited, matching option value slugs)
-- ============================================================
-- ============================================================
-- 1. BUSINESS CARDS — Matrix: print_sides × paper_thickness × lamination
-- ============================================================
-- Client-provided pricing (confirmed):
-- 1-side 250gsm no lam: 3.50 | 1-side 250gsm lam: 4.50
-- 1-side 300gsm no lam: 4.00 | 1-side 300gsm lam: 5.00
-- 2-side 250gsm no lam: 7.00 | 2-side 250gsm lam: 9.00
-- 2-side 300gsm no lam: 8.00 | 2-side 300gsm lam: 10.00
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price)
VALUES -- Front Only (1-side print)
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'front_only|250gsm|none',
        '1 Side, 250gsm, No Lamination',
        3.50
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'front_only|250gsm|matte',
        '1 Side, 250gsm, Matte Lamination',
        4.50
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'front_only|250gsm|glossy',
        '1 Side, 250gsm, Glossy Lamination',
        4.50
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'front_only|300gsm|none',
        '1 Side, 300gsm, No Lamination',
        4.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'front_only|300gsm|matte',
        '1 Side, 300gsm, Matte Lamination',
        5.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'front_only|300gsm|glossy',
        '1 Side, 300gsm, Glossy Lamination',
        5.00
    ),
    -- Both Sides (2-side print)
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'both_sides|250gsm|none',
        '2 Sides, 250gsm, No Lamination',
        7.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'both_sides|250gsm|matte',
        '2 Sides, 250gsm, Matte Lamination',
        9.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'both_sides|250gsm|glossy',
        '2 Sides, 250gsm, Glossy Lamination',
        9.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'both_sides|300gsm|none',
        '2 Sides, 300gsm, No Lamination',
        8.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'both_sides|300gsm|matte',
        '2 Sides, 300gsm, Matte Lamination',
        10.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        'both_sides|300gsm|glossy',
        '2 Sides, 300gsm, Glossy Lamination',
        10.00
    );
-- ============================================================
-- 2. FLYERS — Matrix: print_sides × paper_thickness × lamination
-- ============================================================
-- User-provided pricing (same structure as business cards):
-- NOTE: Flyer paper_thickness options must be updated from 80gsm/150gsm to 250gsm/300gsm
-- NOTE: Lamination option must be added to flyers
-- Step 1: Update existing flyer paper thickness values
UPDATE product_option_values
SET value = '250gsm',
    label = '250gsm'
WHERE option_id = (
        SELECT id
        FROM product_options
        WHERE product_id = (
                SELECT id
                FROM products
                WHERE slug = 'flyers'
            )
            AND option_key = 'paper_thickness'
    )
    AND value = '80gsm';
UPDATE product_option_values
SET value = '300gsm',
    label = '300gsm'
WHERE option_id = (
        SELECT id
        FROM product_options
        WHERE product_id = (
                SELECT id
                FROM products
                WHERE slug = 'flyers'
            )
            AND option_key = 'paper_thickness'
    )
    AND value = '150gsm';
-- Step 2: Add lamination option to flyers (does not exist in current seed)
INSERT INTO product_options (
        product_id,
        option_key,
        option_label,
        field_type,
        is_required,
        display_order
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'lamination',
        'Lamination',
        'radio',
        true,
        4
    );
INSERT INTO product_option_values (
        option_id,
        value,
        label,
        display_order,
        is_default
    )
VALUES (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'flyers'
                )
                AND option_key = 'lamination'
        ),
        'none',
        'None',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'flyers'
                )
                AND option_key = 'lamination'
        ),
        'matte',
        'Matte',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'flyers'
                )
                AND option_key = 'lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Step 3: Flyer pricing matrix
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price)
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'front_only|250gsm|none',
        '1 Side, 250gsm, No Lamination',
        3.50
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'front_only|250gsm|matte',
        '1 Side, 250gsm, Matte Lamination',
        4.50
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'front_only|250gsm|glossy',
        '1 Side, 250gsm, Glossy Lamination',
        4.50
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'front_only|300gsm|none',
        '1 Side, 300gsm, No Lamination',
        4.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'front_only|300gsm|matte',
        '1 Side, 300gsm, Matte Lamination',
        5.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'front_only|300gsm|glossy',
        '1 Side, 300gsm, Glossy Lamination',
        5.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'both_sides|250gsm|none',
        '2 Sides, 250gsm, No Lamination',
        7.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'both_sides|250gsm|matte',
        '2 Sides, 250gsm, Matte Lamination',
        9.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'both_sides|250gsm|glossy',
        '2 Sides, 250gsm, Glossy Lamination',
        9.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'both_sides|300gsm|none',
        '2 Sides, 300gsm, No Lamination',
        8.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'both_sides|300gsm|matte',
        '2 Sides, 300gsm, Matte Lamination',
        10.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        'both_sides|300gsm|glossy',
        '2 Sides, 300gsm, Glossy Lamination',
        10.00
    );
-- ============================================================
-- 3. FOLDERS — Matrix: print_sides × lamination × pocket
-- ============================================================
-- Client catalog pricing:
-- Front Only, 1 pocket: 350 | Front Only, 2 pockets: 380
-- Both Side, 1 pocket: 400  | Both Side, 2 pockets: 450
-- Lamination type (matte/glossy) does not affect price
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price)
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'front_only|matte|right_side',
        'Front Only, Matte, 1 Pocket',
        350.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'front_only|glossy|right_side',
        'Front Only, Glossy, 1 Pocket',
        350.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'front_only|matte|left_right',
        'Front Only, Matte, 2 Pockets',
        380.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'front_only|glossy|left_right',
        'Front Only, Glossy, 2 Pockets',
        380.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'both_sides|matte|right_side',
        'Both Sides, Matte, 1 Pocket',
        400.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'both_sides|glossy|right_side',
        'Both Sides, Glossy, 1 Pocket',
        400.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'both_sides|matte|left_right',
        'Both Sides, Matte, 2 Pockets',
        450.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        'both_sides|glossy|left_right',
        'Both Sides, Glossy, 2 Pockets',
        450.00
    );
-- ============================================================
-- 4. POSTERS — Matrix: paper_thickness × lamination
-- ============================================================
-- Client catalog pricing:
-- 150gsm no lam: 54 | 150gsm with lam: 70
-- 250gsm no lam: 70 | 250gsm with lam: 90
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price)
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '150gsm|none',
        '150gsm, No Lamination',
        54.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '150gsm|matte',
        '150gsm, Matte Lamination',
        70.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '150gsm|glossy',
        '150gsm, Glossy Lamination',
        70.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '250gsm|none',
        '250gsm, No Lamination',
        70.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '250gsm|matte',
        '250gsm, Matte Lamination',
        90.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '250gsm|glossy',
        '250gsm, Glossy Lamination',
        90.00
    );
-- ============================================================
-- 5. PAPER STICKER SHEETS — Matrix: size × lamination
-- ============================================================
-- Client-provided pricing:
-- A4 no lam: 50 | A4 with lam: 60
-- A5 no lam: 25 | A5 with lam: 30
-- A6 no lam: 13 | A6 with lam: 15
-- min_order_quantity: 24 (already set correctly in 002_products.sql)
-- Add lamination option to paper sticker sheets (if not already present)
-- Using INSERT ... ON CONFLICT to be idempotent
INSERT INTO product_options (
        product_id,
        option_key,
        option_label,
        field_type,
        is_required,
        display_order
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'lamination',
        'Lamination',
        'radio',
        true,
        2
    ) ON CONFLICT (product_id, option_key) DO NOTHING;
-- Only insert values if the lamination option was just created (or exists)
INSERT INTO product_option_values (
        option_id,
        value,
        label,
        display_order,
        is_default
    )
SELECT po.id,
    vals.value,
    vals.label,
    vals.display_order,
    vals.is_default
FROM product_options po
    CROSS JOIN (
        VALUES ('none', 'None', 1, true),
            ('matte', 'Matte', 2, false),
            ('glossy', 'Glossy', 3, false)
    ) AS vals(value, label, display_order, is_default)
WHERE po.product_id = (
        SELECT id
        FROM products
        WHERE slug = 'paper-sticker-sheets'
    )
    AND po.option_key = 'lamination'
    AND NOT EXISTS (
        SELECT 1
        FROM product_option_values pov
        WHERE pov.option_id = po.id
            AND pov.value = vals.value
    );
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price)
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a4|none',
        'A4, No Lamination',
        50.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a4|matte',
        'A4, Matte Lamination',
        60.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a4|glossy',
        'A4, Glossy Lamination',
        60.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a5|none',
        'A5, No Lamination',
        25.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a5|matte',
        'A5, Matte Lamination',
        30.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a5|glossy',
        'A5, Glossy Lamination',
        30.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a6|none',
        'A6, No Lamination',
        13.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a6|matte',
        'A6, Matte Lamination',
        15.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'paper-sticker-sheets'
        ),
        'a6|glossy',
        'A6, Glossy Lamination',
        15.00
    );
-- ============================================================
-- 6. BOOKMARKS — Matrix: print_sides × lamination
-- ============================================================
-- Client-provided pricing:
-- Front only, no lam: 10 | Front only, with lam: 12
-- Both side, no lam: 20  | Both side, with lam: 24
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price)
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        'front_only|none',
        'Front Only, No Lamination',
        10.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        'front_only|matte',
        'Front Only, Matte Lamination',
        12.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        'front_only|glossy',
        'Front Only, Glossy Lamination',
        12.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        'both_sides|none',
        'Both Sides, No Lamination',
        20.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        'both_sides|matte',
        'Both Sides, Matte Lamination',
        24.00
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        'both_sides|glossy',
        'Both Sides, Glossy Lamination',
        24.00
    );
-- ============================================================
-- CLEANUP: Remove stale price_amount values from product_option_values
-- that were part of the old additive model for matrix-priced products
-- ============================================================
-- Business Cards: Clear old print_sides override prices
UPDATE product_option_values
SET price_amount = NULL,
    price_type = 'fixed'
WHERE option_id IN (
        SELECT id
        FROM product_options
        WHERE product_id = (
                SELECT id
                FROM products
                WHERE slug = 'business-cards'
            )
            AND option_key IN ('print_sides', 'paper_thickness', 'lamination')
    )
    AND price_amount IS NOT NULL;
-- Bookmarks: Clear any old prices on option values
UPDATE product_option_values
SET price_amount = NULL,
    price_type = 'fixed'
WHERE option_id IN (
        SELECT id
        FROM product_options
        WHERE product_id = (
                SELECT id
                FROM products
                WHERE slug = 'bookmarks'
            )
    )
    AND price_amount IS NOT NULL;
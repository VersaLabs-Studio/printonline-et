-- PrintOnline.et v2.0 — Seed: Product Options & Values (Part 1)
-- Business Essentials: Business Cards, Letterhead, Envelopes, Folders
-- Run AFTER 002_products.sql
-- All prices in ETB
-- ============================================================
-- BUSINESS CARDS — 5 options
-- ============================================================
-- Option: Size
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
            WHERE slug = 'business-cards'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    );
INSERT INTO product_option_values (
        option_id,
        value,
        label,
        display_order,
        is_default,
        description
    )
VALUES (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'size'
        ),
        'standard',
        'Standard (8.5cm x 5.5cm)',
        1,
        true,
        'Most common size in Ethiopia'
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'size'
        ),
        'us-standard',
        'US Standard (9cm x 5.4cm)',
        2,
        false,
        'International standard size'
    );
-- Option: Print Sides
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
            WHERE slug = 'business-cards'
        ),
        'print_sides',
        'Print Sides',
        'radio',
        true,
        2
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
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'print_sides'
        ),
        'front_only',
        'Front Print Only',
        1,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'print_sides'
        ),
        'both_sides',
        'Both Side Print',
        2,
        true
    );
-- Option: Paper Thickness
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
            WHERE slug = 'business-cards'
        ),
        'paper_thickness',
        'Paper Thickness',
        'radio',
        true,
        3
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
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'paper_thickness'
        ),
        '250gsm',
        '250gsm',
        1,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'paper_thickness'
        ),
        '300gsm',
        '300gsm',
        2,
        true
    );
-- Option: Corners
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
            WHERE slug = 'business-cards'
        ),
        'corners',
        'Corners',
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
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'corners'
        ),
        'rounded',
        'Rounded',
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
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'corners'
        ),
        'sharp',
        'Sharp Edge',
        2,
        false
    );
-- Option: Lamination
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
            WHERE slug = 'business-cards'
        ),
        'lamination',
        'Lamination',
        'radio',
        true,
        5
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
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'lamination'
        ),
        'none',
        'None',
        1,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'lamination'
        ),
        'matte',
        'Matte',
        2,
        true
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'business-cards'
                )
                AND option_key = 'lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Business Cards — PRICING TABLE (price_amount = per-card ETB based on combination)
-- 1-side 250gsm no lam: 3.50 | 1-side 250gsm lam: 4.50 | 1-side 300gsm: 4.00 | 1-side 300gsm lam: 5.00
-- 2-side 250gsm no lam: 7.00 | 2-side 250gsm lam: 9.00 | 2-side 300gsm: 8.00 | 2-side 300gsm lam: 10.00
-- Note: Complex combo pricing will be handled by a pricing matrix in the app logic.
-- For the DB we store the individual option base modifiers:
UPDATE product_option_values
SET price_amount = 3.50,
    price_type = 'override'
WHERE option_id = (
        SELECT id
        FROM product_options
        WHERE product_id = (
                SELECT id
                FROM products
                WHERE slug = 'business-cards'
            )
            AND option_key = 'print_sides'
    )
    AND value = 'front_only';
UPDATE product_option_values
SET price_amount = 7.00,
    price_type = 'override'
WHERE option_id = (
        SELECT id
        FROM product_options
        WHERE product_id = (
                SELECT id
                FROM products
                WHERE slug = 'business-cards'
            )
            AND option_key = 'print_sides'
    )
    AND value = 'both_sides';
-- ============================================================
-- LETTERHEAD — No configurable options (fixed product)
-- ============================================================
-- Letterhead is a fixed-spec product: 80gsm, single side, 15 ETB/pc
-- No options needed — base_price covers it
-- ============================================================
-- ENVELOPES — 1 option: Size
-- ============================================================
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
            WHERE slug = 'envelopes'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    );
INSERT INTO product_option_values (
        option_id,
        value,
        label,
        price_amount,
        price_type,
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
                    WHERE slug = 'envelopes'
                )
                AND option_key = 'size'
        ),
        'dl',
        'DL (9.9cm x 21cm)',
        25.00,
        'override',
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
                    WHERE slug = 'envelopes'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
        35.00,
        'override',
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
                    WHERE slug = 'envelopes'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
        50.00,
        'override',
        3,
        false
    );
-- ============================================================
-- FOLDERS — 3 options: Print Sides, Lamination, Pocket
-- ============================================================
-- Option: Print Sides
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
            WHERE slug = 'folders'
        ),
        'print_sides',
        'Print Sides',
        'radio',
        true,
        1
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
                    WHERE slug = 'folders'
                )
                AND option_key = 'print_sides'
        ),
        'front_only',
        'Front Print Only',
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
                    WHERE slug = 'folders'
                )
                AND option_key = 'print_sides'
        ),
        'both_sides',
        'Both Side Print',
        2,
        false
    );
-- Option: Lamination
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
            WHERE slug = 'folders'
        ),
        'lamination',
        'Lamination',
        'radio',
        true,
        2
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
                    WHERE slug = 'folders'
                )
                AND option_key = 'lamination'
        ),
        'matte',
        'Matte',
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
                    WHERE slug = 'folders'
                )
                AND option_key = 'lamination'
        ),
        'glossy',
        'Glossy',
        2,
        false
    );
-- Option: Pocket
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
            WHERE slug = 'folders'
        ),
        'pocket',
        'Pocket',
        'radio',
        true,
        3
    );
INSERT INTO product_option_values (
        option_id,
        value,
        label,
        price_amount,
        price_type,
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
                    WHERE slug = 'folders'
                )
                AND option_key = 'pocket'
        ),
        'right_side',
        'Right Side (1 Pocket)',
        350.00,
        'override',
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
                    WHERE slug = 'folders'
                )
                AND option_key = 'pocket'
        ),
        'left_right',
        'Left & Right (2 Pockets)',
        380.00,
        'override',
        2,
        false
    );
-- Folders pricing matrix (per catalog):
-- Front Only, 1 pocket: 350 | Front Only, 2 pockets: 380
-- Both Side, 1 pocket: 400  | Both Side, 2 pockets: 450
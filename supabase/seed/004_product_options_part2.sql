-- PrintOnline.et v2.0 — Seed: Product Options & Values (Part 2)
-- Marketing Materials: Flyers, Brochures, Posters, Bookmarks
-- Run AFTER 003_product_options_part1.sql
-- ============================================================
-- FLYERS — 3 options: Size, Print Sides, Paper Thickness
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
            WHERE slug = 'flyers'
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
        description,
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
                AND option_key = 'size'
        ),
        'dl',
        'DL (9.9cm x 21cm)',
        'Common size',
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
                AND option_key = 'size'
        ),
        'a6',
        'A6 (14.85cm x 10.5cm)',
        'Common size',
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
                    WHERE slug = 'flyers'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
        NULL,
        3,
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
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
        NULL,
        4,
        false
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
            WHERE slug = 'flyers'
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
                    WHERE slug = 'flyers'
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
                    WHERE slug = 'flyers'
                )
                AND option_key = 'print_sides'
        ),
        'both_sides',
        'Both Side Print',
        2,
        false
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
            WHERE slug = 'flyers'
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
                    WHERE slug = 'flyers'
                )
                AND option_key = 'paper_thickness'
        ),
        '80gsm',
        '80gsm',
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
                    WHERE slug = 'flyers'
                )
                AND option_key = 'paper_thickness'
        ),
        '150gsm',
        '150gsm',
        2,
        true
    );
-- Flyers pricing reference (per catalog, ETB per piece):
-- DL  80gsm front:  7  | DL  80gsm both: 14 | DL  150gsm front:  9  | DL  150gsm both: 18
-- A6  80gsm front:  5  | A6  80gsm both: 10 | A6  150gsm front:  7  | A6  150gsm both: 14
-- A5  80gsm front: 10  | A5  80gsm both: 20 | A5  150gsm front: 14  | A5  150gsm both: 28
-- A4  80gsm front: 20  | A4  80gsm both: 40 | A4  150gsm front: 28  | A4  150gsm both: 54
-- ============================================================
-- BROCHURES — 2 options: Type, Size
-- ============================================================
-- Option: Fold Type
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
            WHERE slug = 'brochures'
        ),
        'fold_type',
        'Fold Type',
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
                    WHERE slug = 'brochures'
                )
                AND option_key = 'fold_type'
        ),
        'tri-fold',
        'Tri-fold',
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
                    WHERE slug = 'brochures'
                )
                AND option_key = 'fold_type'
        ),
        'bi-fold',
        'Bi-fold',
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
                    WHERE slug = 'brochures'
                )
                AND option_key = 'fold_type'
        ),
        'z-fold',
        'Z-fold',
        3,
        false
    );
-- Option: Size (Unfolded)
INSERT INTO product_options (
        product_id,
        option_key,
        option_label,
        field_type,
        is_required,
        display_order,
        description
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'brochures'
        ),
        'size',
        'Unfolded Size',
        'radio',
        true,
        2,
        'Size when fully open'
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
                    WHERE slug = 'brochures'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
        40.00,
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
                    WHERE slug = 'brochures'
                )
                AND option_key = 'size'
        ),
        'a3',
        'A3 (42cm x 29.7cm)',
        80.00,
        'override',
        2,
        false
    );
-- ============================================================
-- POSTERS — 2 options: Paper Thickness, Lamination
-- ============================================================
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
            WHERE slug = 'posters'
        ),
        'paper_thickness',
        'Paper Thickness',
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
                    WHERE slug = 'posters'
                )
                AND option_key = 'paper_thickness'
        ),
        '150gsm',
        '150gsm',
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
                    WHERE slug = 'posters'
                )
                AND option_key = 'paper_thickness'
        ),
        '250gsm',
        '250gsm',
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
            WHERE slug = 'posters'
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
                    WHERE slug = 'posters'
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
                    WHERE slug = 'posters'
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
                    WHERE slug = 'posters'
                )
                AND option_key = 'lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Poster pricing (ETB per piece):
-- 150gsm no lamination: 54 | 250gsm no lamination: 70
-- 150gsm with lamination: 70 | 250gsm with lamination: 90
-- ============================================================
-- BOOKMARKS — 2 options: Print Side, Lamination
-- ============================================================
-- Option: Print Side
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
            WHERE slug = 'bookmarks'
        ),
        'print_sides',
        'Print Side',
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
                    WHERE slug = 'bookmarks'
                )
                AND option_key = 'print_sides'
        ),
        'front_only',
        'Front Only',
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
                    WHERE slug = 'bookmarks'
                )
                AND option_key = 'print_sides'
        ),
        'both_sides',
        'Both Side',
        2,
        true
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
            WHERE slug = 'bookmarks'
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
                    WHERE slug = 'bookmarks'
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
                    WHERE slug = 'bookmarks'
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
                    WHERE slug = 'bookmarks'
                )
                AND option_key = 'lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Bookmark pricing (ETB per piece):
-- Front only, no lam: 10 | Front only, with lam: 12
-- Both side, no lam: 20  | Both side, with lam: 24
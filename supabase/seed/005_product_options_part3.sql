-- PrintOnline.et v2.0 — Seed: Product Options & Values (Part 3)
-- Booklets & Publications, Stickers & Labels, Gifts & Packaging
-- Run AFTER 004_product_options_part2.sql
-- ============================================================
-- SADDLE-STITCHED BOOKLETS — 5 options
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
            WHERE slug = 'saddle-stitched-booklets'
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
        is_default
    )
VALUES (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'size'
        ),
        'a6',
        'A6 (14.85cm x 10.5cm)',
        3,
        false
    );
-- Option: Cover Paper Thickness
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
            WHERE slug = 'saddle-stitched-booklets'
        ),
        'cover_paper',
        'Cover Paper Thickness',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'cover_paper'
        ),
        '250gsm',
        '250gsm',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'cover_paper'
        ),
        '300gsm',
        '300gsm',
        2,
        false
    );
-- Option: Cover Lamination
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
            WHERE slug = 'saddle-stitched-booklets'
        ),
        'cover_lamination',
        'Cover Paper Lamination',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'cover_lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Option: Inside Paper Type
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
            WHERE slug = 'saddle-stitched-booklets'
        ),
        'inside_paper',
        'Inside Paper Type',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'inside_paper'
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'inside_paper'
        ),
        '150gsm',
        '150gsm',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'inside_paper'
        ),
        'same_as_cover',
        'Same as Cover Paper',
        3,
        false
    );
-- Option: Number of Pages
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
            WHERE slug = 'saddle-stitched-booklets'
        ),
        'page_count',
        'Number of Pages (incl. Cover)',
        'select',
        true,
        5,
        'Total pages must be divisible by 4 (e.g., 8, 12, 16...)'
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '8',
        '8 Pages',
        'Cover + 4 inside pages',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '12',
        '12 Pages',
        'Cover + 8 inside pages',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '16',
        '16 Pages',
        'Cover + 12 inside pages',
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
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '20',
        '20 Pages',
        'Cover + 16 inside pages',
        4,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '24',
        '24 Pages',
        'Cover + 20 inside pages',
        5,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '28',
        '28 Pages',
        'Cover + 24 inside pages',
        6,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '32',
        '32 Pages',
        'Cover + 28 inside pages',
        7,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '36',
        '36 Pages',
        'Cover + 32 inside pages',
        8,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '40',
        '40 Pages',
        'Cover + 36 inside pages',
        9,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '48',
        '48 Pages',
        'Cover + 44 inside pages',
        10,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '56',
        '56 Pages',
        'Cover + 52 inside pages',
        11,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '64',
        '64 Pages',
        'Cover + 60 inside pages',
        12,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '72',
        '72 Pages',
        'Cover + 68 inside pages',
        13,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'saddle-stitched-booklets'
                )
                AND option_key = 'page_count'
        ),
        '76',
        '76 Pages',
        'Cover + 72 inside pages',
        14,
        false
    );
-- ============================================================
-- PERFECT-BOUND BOOKLETS — Same options as saddle-stitched minus page count restriction
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
            WHERE slug = 'perfect-bound-booklets'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'perfect-bound-booklets'
        ),
        'cover_paper',
        'Cover Paper Thickness',
        'radio',
        true,
        2
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'perfect-bound-booklets'
        ),
        'cover_lamination',
        'Cover Paper Lamination',
        'radio',
        true,
        3
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'perfect-bound-booklets'
        ),
        'inside_paper',
        'Inside Paper Type',
        'radio',
        true,
        4
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'perfect-bound-booklets'
        ),
        'page_count',
        'Number of Pages (incl. Cover)',
        'select',
        true,
        5
    );
-- Size values
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a6',
        'A6 (14.85cm x 10.5cm)',
        3,
        false
    );
-- Cover paper values
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'cover_paper'
        ),
        '250gsm',
        '250gsm',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'cover_paper'
        ),
        '300gsm',
        '300gsm',
        2,
        false
    );
-- Cover lamination values
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'cover_lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Inside paper values
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'inside_paper'
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'inside_paper'
        ),
        '150gsm',
        '150gsm',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'inside_paper'
        ),
        'same_as_cover',
        'Same as Cover Paper',
        3,
        false
    );
-- Page count values (perfect-bound has more flexibility)
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '20',
        '20 Pages',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '28',
        '28 Pages',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '36',
        '36 Pages',
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
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '48',
        '48 Pages',
        4,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '64',
        '64 Pages',
        5,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '80',
        '80 Pages',
        6,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'perfect-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '100',
        '100 Pages',
        7,
        false
    );
-- ============================================================
-- WIRE-BOUND BOOKLETS — 6 options (adds binding alignment + A3 size)
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
            WHERE slug = 'wire-bound-booklets'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'wire-bound-booklets'
        ),
        'binding_alignment',
        'Binding Alignment',
        'radio',
        true,
        2
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'wire-bound-booklets'
        ),
        'cover_paper',
        'Cover Paper Thickness',
        'radio',
        true,
        3
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'wire-bound-booklets'
        ),
        'cover_lamination',
        'Cover Paper Lamination',
        'radio',
        true,
        4
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'wire-bound-booklets'
        ),
        'inside_paper',
        'Inside Paper Type',
        'radio',
        true,
        5
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'wire-bound-booklets'
        ),
        'page_count',
        'Number of Pages (incl. Cover)',
        'select',
        true,
        6
    );
-- Size values (includes A3)
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a3',
        'A3 (42cm x 29.7cm)',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'size'
        ),
        'a6',
        'A6 (14.85cm x 10.5cm)',
        4,
        false
    );
-- Binding Alignment
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'binding_alignment'
        ),
        'left',
        'Left',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'binding_alignment'
        ),
        'top',
        'Top',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'binding_alignment'
        ),
        'right',
        'Right',
        3,
        false
    );
-- Cover paper, lamination, inside paper (same as saddle-stitched)
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'cover_paper'
        ),
        '250gsm',
        '250gsm',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'cover_paper'
        ),
        '300gsm',
        '300gsm',
        2,
        false
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'cover_lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'inside_paper'
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'inside_paper'
        ),
        '150gsm',
        '150gsm',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'inside_paper'
        ),
        'same_as_cover',
        'Same as Cover Paper',
        3,
        false
    );
-- Page count
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '20',
        '20 Pages',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '28',
        '28 Pages',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '36',
        '36 Pages',
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
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '48',
        '48 Pages',
        4,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '64',
        '64 Pages',
        5,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '80',
        '80 Pages',
        6,
        false
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'wire-bound-booklets'
                )
                AND option_key = 'page_count'
        ),
        '100',
        '100 Pages',
        7,
        false
    );
-- ============================================================
-- NOTEBOOKS — 6 options
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
            WHERE slug = 'notebooks'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        'sheet_count',
        'Number of Sheets',
        'radio',
        true,
        2
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        'filler_paper',
        'Filler Paper',
        'radio',
        true,
        3
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        'cover_print',
        'Cover Page Print',
        'radio',
        true,
        4
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        'cover_paper',
        'Cover Paper Thickness',
        'radio',
        true,
        5
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        'cover_lamination',
        'Cover Paper Lamination',
        'radio',
        true,
        6
    );
-- Size
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'size'
        ),
        'a6',
        'A6 (14.85cm x 10.5cm)',
        3,
        false
    );
-- Sheet Count
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'sheet_count'
        ),
        '25',
        '25 Sheets',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'sheet_count'
        ),
        '50',
        '50 Sheets',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'sheet_count'
        ),
        '100',
        '100 Sheets',
        3,
        false
    );
-- Filler Paper
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'filler_paper'
        ),
        'blank',
        'Blank',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'filler_paper'
        ),
        'college_ruled',
        'College Ruled',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'filler_paper'
        ),
        'custom_full_color',
        'Custom Full Color',
        3,
        false
    );
-- Cover Print
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_print'
        ),
        'cover_only',
        'Cover Pages Only',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_print'
        ),
        'including_insides',
        'Print Including Cover Insides',
        2,
        false
    );
-- Cover Paper
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_paper'
        ),
        '250gsm',
        '250gsm',
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_paper'
        ),
        '300gsm',
        '300gsm',
        2,
        false
    );
-- Cover Lamination
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_lamination'
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
                    WHERE slug = 'notebooks'
                )
                AND option_key = 'cover_lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- ============================================================
-- PAPER STICKER SHEETS — 2 options: Size, Lamination
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
            WHERE slug = 'paper-sticker-sheets'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    ),
    (
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
    );
-- Size
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
                    WHERE slug = 'paper-sticker-sheets'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
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
                    WHERE slug = 'paper-sticker-sheets'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
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
                    WHERE slug = 'paper-sticker-sheets'
                )
                AND option_key = 'size'
        ),
        'a6',
        'A6 (14.85cm x 10.5cm)',
        3,
        false
    );
-- Lamination
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
                    WHERE slug = 'paper-sticker-sheets'
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
                    WHERE slug = 'paper-sticker-sheets'
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
                    WHERE slug = 'paper-sticker-sheets'
                )
                AND option_key = 'lamination'
        ),
        'glossy',
        'Glossy',
        3,
        false
    );
-- Sticker pricing (ETB per sheet):
-- A4 no lam: 50 | A4 lam: 60
-- A5 no lam: 25 | A5 lam: 30
-- A6 no lam: 13 | A6 lam: 15
-- ============================================================
-- PREMIUM GIFT BAGS — 3 options: Size, Orientation, Handle Color
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
            WHERE slug = 'premium-gift-bags'
        ),
        'size',
        'Size',
        'radio',
        true,
        1
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'premium-gift-bags'
        ),
        'orientation',
        'Orientation',
        'radio',
        true,
        2
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'premium-gift-bags'
        ),
        'handle_color',
        'Handle Rope Color',
        'radio',
        true,
        3
    );
-- Size
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
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'size'
        ),
        'a5',
        'A5 (21cm x 14.85cm)',
        250.00,
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
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'size'
        ),
        'a4',
        'A4 (29.7cm x 21cm)',
        350.00,
        'override',
        2,
        false
    );
-- Orientation
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
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'orientation'
        ),
        'portrait',
        'Portrait',
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
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'orientation'
        ),
        'landscape',
        'Landscape',
        2,
        false
    );
-- Handle Color
INSERT INTO product_option_values (
        option_id,
        value,
        label,
        display_order,
        is_default,
        metadata
    )
VALUES (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'handle_color'
        ),
        'white',
        'White',
        1,
        true,
        '{"hex": "#FFFFFF"}'::jsonb
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'handle_color'
        ),
        'black',
        'Black',
        2,
        false,
        '{"hex": "#000000"}'::jsonb
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'handle_color'
        ),
        'blue',
        'Blue',
        3,
        false,
        '{"hex": "#1E40AF"}'::jsonb
    ),
    (
        (
            SELECT id
            FROM product_options
            WHERE product_id = (
                    SELECT id
                    FROM products
                    WHERE slug = 'premium-gift-bags'
                )
                AND option_key = 'handle_color'
        ),
        'burgundy',
        'Burgundy',
        4,
        false,
        '{"hex": "#800020"}'::jsonb
    );
-- ============================================================
-- CERTIFICATE PAPER — 1 option: Paper Type (price varies)
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
            WHERE slug = 'certificate-paper'
        ),
        'paper_type',
        'Paper Type',
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
                    WHERE slug = 'certificate-paper'
                )
                AND option_key = 'paper_type'
        ),
        'white_hard',
        'White Hard Paper (300gsm)',
        40.00,
        'override',
        'Premium 300gsm white cardstock',
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
                    WHERE slug = 'certificate-paper'
                )
                AND option_key = 'paper_type'
        ),
        'textured',
        'Textured Paper (250gsm)',
        60.00,
        'override',
        'Elegant 250gsm textured finish',
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
                    WHERE slug = 'certificate-paper'
                )
                AND option_key = 'paper_type'
        ),
        'golden_frame',
        'Golden Frame Paper',
        60.00,
        'override',
        'Premium paper with golden border frame',
        3,
        false
    );
-- PrintOnline.et v2.0 — Seed: Products
-- 15 products extracted from client catalog PDF with ETB pricing
-- Run AFTER 001_categories.sql
-- All prices are per-unit in Ethiopian Birr (ETB)
-- Use category IDs by subquery for portability
INSERT INTO products (
        name,
        slug,
        category_id,
        description,
        short_description,
        base_price,
        currency,
        form_type,
        stock_status,
        min_order_quantity,
        badge,
        features,
        specifications,
        display_order
    )
VALUES -- ============================================================
    -- BUSINESS ESSENTIALS
    -- ============================================================
    -- 1. Business Cards
    (
        'Business Cards',
        'business-cards',
        (
            SELECT id
            FROM categories
            WHERE slug = 'business-essentials'
        ),
        'Make a powerful first impression with our premium business cards. Printed on high-quality cardstock with your choice of paper thickness, lamination finish, and corner style. Available in standard Ethiopian and US standard sizes.',
        'Premium business cards on 250gsm or 300gsm cardstock with optional lamination.',
        3.50,
        'ETB',
        'paper',
        'in_stock',
        50,
        'Best Seller',
        '["Premium Cardstock", "Matte & Glossy Lamination", "Rounded or Sharp Corners", "Both Side Printing", "Quick Turnaround"]'::jsonb,
        '[{"label": "Standard Size", "value": "8.5cm x 5.5cm"}, {"label": "US Standard", "value": "9cm x 5.4cm"}, {"label": "Paper Options", "value": "250gsm / 300gsm"}, {"label": "Min Order", "value": "50 cards"}]'::jsonb,
        1
    ),
    -- 2. Letterhead
    (
        'Letterhead',
        'letterhead',
        (
            SELECT id
            FROM categories
            WHERE slug = 'business-essentials'
        ),
        'Print high-quality letterheads for your business. Letterheads are printed one side on premium 80gsm plain paper, perfect for official correspondence and corporate communications.',
        'Professional one-sided letterheads on 80gsm paper.',
        15.00,
        'ETB',
        'paper',
        'in_stock',
        50,
        NULL,
        '["High Quality 80gsm Paper", "Single Side Print", "Full Color", "Professional Finish"]'::jsonb,
        '[{"label": "Paper", "value": "80gsm Premium"}, {"label": "Print", "value": "Single Side, Full Color"}, {"label": "Min Order", "value": "50 pieces"}]'::jsonb,
        2
    ),
    -- 3. Envelopes
    (
        'Envelopes',
        'envelopes',
        (
            SELECT id
            FROM categories
            WHERE slug = 'business-essentials'
        ),
        'Custom printed envelopes in DL, A5, and A4 sizes. Professional branded envelopes for your business correspondence. Printed on quality stock for a premium look and feel.',
        'Custom branded envelopes in DL, A5, and A4 sizes.',
        25.00,
        'ETB',
        'paper',
        'in_stock',
        25,
        NULL,
        '["Multiple Sizes Available", "Custom Full Color Print", "Professional Business Look", "Quality Paper Stock"]'::jsonb,
        '[{"label": "DL Size", "value": "9.9cm x 21cm"}, {"label": "A5 Size", "value": "21cm x 14.85cm"}, {"label": "A4 Size", "value": "29.7cm x 21cm"}, {"label": "Min Order", "value": "25 pieces"}]'::jsonb,
        3
    ),
    -- 4. Folders
    (
        'Folders',
        'folders',
        (
            SELECT id
            FROM categories
            WHERE slug = 'business-essentials'
        ),
        'Print high-quality branded presentation folders on 300gsm paper. Perfect for holding A4 size presentation documents. Available with one or two pockets and choice of lamination finish.',
        'Branded 300gsm presentation folders with pocket options.',
        350.00,
        'ETB',
        'paper',
        'in_stock',
        50,
        'Premium',
        '["300gsm Premium Paper", "Holds A4 Documents", "1 or 2 Pockets", "Matte & Glossy Lamination", "Both Side Print Available"]'::jsonb,
        '[{"label": "Paper", "value": "300gsm"}, {"label": "Pockets", "value": "Right Side or Left & Right"}, {"label": "Lamination", "value": "Matte / Glossy"}, {"label": "Min Order", "value": "50 pieces"}]'::jsonb,
        4
    ),
    -- ============================================================
    -- MARKETING MATERIALS
    -- ============================================================
    -- 5. Flyers
    (
        'Flyers',
        'flyers',
        (
            SELECT id
            FROM categories
            WHERE slug = 'marketing-materials'
        ),
        'High impact flyers printed in vibrant full color. Available in DL, A6, A5, and A4 sizes on 80gsm or 150gsm paper. Single or double-sided printing for maximum visibility.',
        'Full color flyers in multiple sizes on 80gsm or 150gsm paper.',
        5.00,
        'ETB',
        'paper',
        'in_stock',
        50,
        'Popular',
        '["Multiple Size Options", "80gsm & 150gsm Paper", "Single or Double Sided", "Vibrant Full Color", "Fast Production"]'::jsonb,
        '[{"label": "DL", "value": "9.9cm x 21cm"}, {"label": "A6", "value": "14.85cm x 10.5cm"}, {"label": "A5", "value": "21cm x 14.85cm"}, {"label": "A4", "value": "29.7cm x 21cm"}, {"label": "Min Order", "value": "50 pieces"}]'::jsonb,
        5
    ),
    -- 6. Brochures
    (
        'Brochures',
        'brochures',
        (
            SELECT id
            FROM categories
            WHERE slug = 'marketing-materials'
        ),
        'Professional tri-fold, bi-fold, and z-fold brochures printed on 150gsm paper. Available in A4 and A3 unfolded sizes. Perfect for product catalogs, service menus, and company profiles.',
        'Tri-fold, bi-fold, and z-fold brochures on 150gsm paper.',
        40.00,
        'ETB',
        'paper',
        'in_stock',
        50,
        NULL,
        '["Tri-fold, Bi-fold, Z-fold Options", "150gsm Quality Paper", "Full Color Both Sides", "A4 & A3 Sizes"]'::jsonb,
        '[{"label": "Paper", "value": "150gsm"}, {"label": "A4 Unfolded", "value": "29.7cm x 21cm"}, {"label": "A3 Unfolded", "value": "42cm x 29.7cm"}, {"label": "Min Order", "value": "50 pieces"}]'::jsonb,
        6
    ),
    -- 7. Posters
    (
        'Posters',
        'posters',
        (
            SELECT id
            FROM categories
            WHERE slug = 'marketing-materials'
        ),
        'A3 size high-quality posters with vibrant full color printing. Available on 150gsm or 250gsm paper with optional matte or glossy lamination. Ideal for promotions, events, and in-store displays.',
        'A3 full color posters on 150gsm or 250gsm paper.',
        54.00,
        'ETB',
        'paper',
        'in_stock',
        50,
        NULL,
        '["A3 Size Format", "150gsm & 250gsm Paper", "Optional Lamination", "Vibrant Full Color", "Perfect for Displays"]'::jsonb,
        '[{"label": "Size", "value": "A3 (42cm x 29.7cm)"}, {"label": "Paper Options", "value": "150gsm / 250gsm"}, {"label": "Lamination", "value": "None / Matte / Glossy"}, {"label": "Min Order", "value": "50 pieces"}]'::jsonb,
        7
    ),
    -- 8. Bookmarks
    (
        'Bookmarks',
        'bookmarks',
        (
            SELECT id
            FROM categories
            WHERE slug = 'marketing-materials'
        ),
        'Standard size bookmarks printed on premium 300gsm paper. Available with single or double-sided printing and optional matte or glossy lamination. A versatile marketing tool or reading accessory.',
        'Standard 5cm x 15cm bookmarks on 300gsm paper.',
        10.00,
        'ETB',
        'paper',
        'in_stock',
        50,
        NULL,
        '["300gsm Premium Paper", "Standard 5cm x 15cm", "Single or Double Sided", "Optional Lamination"]'::jsonb,
        '[{"label": "Size", "value": "5cm x 15cm"}, {"label": "Paper", "value": "300gsm"}, {"label": "Lamination", "value": "None / Matte / Glossy"}, {"label": "Min Order", "value": "50 pieces"}]'::jsonb,
        8
    ),
    -- ============================================================
    -- BOOKLETS & PUBLICATIONS
    -- ============================================================
    -- 9. Saddle-Stitched Booklets
    (
        'Saddle-Stitched Booklets',
        'saddle-stitched-booklets',
        (
            SELECT id
            FROM categories
            WHERE slug = 'booklets-publications'
        ),
        'Professional saddle-stitched booklets in A4, A5, and A6 sizes. Choose your cover paper thickness, lamination, and inside paper type. Page count must be divisible by 4 (e.g., 8, 12, 16... up to 76 pages including cover).',
        'Staple-bound booklets with customizable cover and inside pages.',
        0,
        'ETB',
        'paper',
        'in_stock',
        50,
        NULL,
        '["Multiple Size Options", "250gsm or 300gsm Cover", "80gsm or 150gsm Inside Pages", "Matte & Glossy Lamination", "8 to 76 Pages"]'::jsonb,
        '[{"label": "Sizes", "value": "A4 / A5 / A6"}, {"label": "Cover", "value": "250gsm or 300gsm"}, {"label": "Binding", "value": "Saddle-Stitched (Stapled)"}, {"label": "Pages", "value": "8 to 76 (multiples of 4)"}]'::jsonb,
        9
    ),
    -- 10. Perfect-Bound Booklets
    (
        'Perfect-Bound Booklets',
        'perfect-bound-booklets',
        (
            SELECT id
            FROM categories
            WHERE slug = 'booklets-publications'
        ),
        'High-end perfect-bound booklets with a professional flat spine. Available in A4, A5, and A6 sizes with premium cover options and choice of inside paper. Ideal for company profiles, annual reports, and catalogs.',
        'Professional flat-spine booklets for a premium finish.',
        0,
        'ETB',
        'paper',
        'in_stock',
        50,
        'Premium',
        '["Professional Flat Spine", "250gsm or 300gsm Cover", "80gsm or 150gsm Inside Pages", "Matte & Glossy Lamination", "Premium Finish"]'::jsonb,
        '[{"label": "Sizes", "value": "A4 / A5 / A6"}, {"label": "Cover", "value": "250gsm or 300gsm"}, {"label": "Binding", "value": "Perfect Bound (Glued Spine)"}, {"label": "Inside Paper", "value": "80gsm / 150gsm / Same as Cover"}]'::jsonb,
        10
    ),
    -- 11. Wire-Bound (Spiral) Booklets
    (
        'Wire-Bound Booklets',
        'wire-bound-booklets',
        (
            SELECT id
            FROM categories
            WHERE slug = 'booklets-publications'
        ),
        'Wire-bound spiral booklets that lay flat when opened. Available in A3, A4, A5, and A6 sizes with left, top, or right binding alignment. Perfect for training manuals, notebooks, and reference guides.',
        'Spiral-bound booklets that lay flat, with flexible binding alignment.',
        0,
        'ETB',
        'paper',
        'in_stock',
        50,
        NULL,
        '["Lays Flat When Open", "Left, Top, or Right Binding", "A3 to A6 Sizes", "250gsm or 300gsm Cover", "Multiple Inside Paper Options"]'::jsonb,
        '[{"label": "Sizes", "value": "A3 / A4 / A5 / A6"}, {"label": "Binding", "value": "Wire-Bound (Spiral)"}, {"label": "Alignment", "value": "Left / Top / Right"}, {"label": "Cover", "value": "250gsm or 300gsm"}]'::jsonb,
        11
    ),
    -- 12. Notebooks
    (
        'Notebooks',
        'notebooks',
        (
            SELECT id
            FROM categories
            WHERE slug = 'booklets-publications'
        ),
        'Custom branded notebooks in A4, A5, and A6 sizes. Choose from 25, 50, or 100 sheets with blank, college ruled, or custom full color filler paper. Premium cover with optional lamination.',
        'Custom branded notebooks with flexible size, sheet count, and paper options.',
        0,
        'ETB',
        'paper',
        'in_stock',
        50,
        'Popular',
        '["25, 50, or 100 Sheets", "Blank, Ruled, or Custom Filler", "Custom Cover Print", "250gsm or 300gsm Cover", "Multiple Sizes"]'::jsonb,
        '[{"label": "Sizes", "value": "A4 / A5 / A6"}, {"label": "Sheets", "value": "25 / 50 / 100"}, {"label": "Filler Paper", "value": "Blank / College Ruled / Custom Full Color"}, {"label": "Cover", "value": "250gsm or 300gsm with Lamination"}]'::jsonb,
        12
    ),
    -- ============================================================
    -- STICKERS & LABELS
    -- ============================================================
    -- 13. Paper Sticker Sheets
    (
        'Paper Sticker Sheets',
        'paper-sticker-sheets',
        (
            SELECT id
            FROM categories
            WHERE slug = 'stickers-labels'
        ),
        'Full color paper sticker sheets in A4, A5, and A6 sizes. Available with or without lamination for added protection. Perfect for product labels, promotional stickers, and packaging.',
        'Custom paper sticker sheets with optional lamination.',
        13.00,
        'ETB',
        'paper',
        'in_stock',
        24,
        NULL,
        '["Full Color Print", "A4, A5, A6 Sizes", "Optional Lamination", "Paper Sticker Material", "Great for Labels & Branding"]'::jsonb,
        '[{"label": "A4", "value": "29.7cm x 21cm"}, {"label": "A5", "value": "21cm x 14.85cm"}, {"label": "A6", "value": "14.85cm x 10.5cm"}, {"label": "Lamination", "value": "None / Matte / Glossy"}, {"label": "Min Order", "value": "24 sheets"}]'::jsonb,
        13
    ),
    -- ============================================================
    -- GIFTS & PACKAGING
    -- ============================================================
    -- 14. Premium Gift Bags
    (
        'Premium Gift Bags',
        'premium-gift-bags',
        (
            SELECT id
            FROM categories
            WHERE slug = 'gifts-packaging'
        ),
        'Luxurious custom printed gift bags in A4 and A5 sizes. Choose between portrait and landscape orientation with colored rope handles. Available in white, black, blue, and burgundy handle colors.',
        'Custom branded gift bags with rope handles in multiple colors.',
        250.00,
        'ETB',
        'gift',
        'in_stock',
        50,
        'Premium',
        '["Full Color Custom Print", "Durable Rope Handles", "4 Handle Color Options", "Portrait & Landscape", "Premium Quality Material"]'::jsonb,
        '[{"label": "A5", "value": "21cm x 14.85cm — ETB 250"}, {"label": "A4", "value": "29.7cm x 21cm — ETB 350"}, {"label": "Handle Colors", "value": "White / Black / Blue / Burgundy"}, {"label": "Min Order", "value": "50 bags"}]'::jsonb,
        14
    ),
    -- 15. Certificate Paper
    (
        'Certificate Paper',
        'certificate-paper',
        (
            SELECT id
            FROM categories
            WHERE slug = 'gifts-packaging'
        ),
        'A4 size professional certificate papers for awards, recognition, and achievements. Choose from white hard paper (300gsm), textured paper (250gsm), or elegant golden frame paper for premium presentations.',
        'Professional A4 certificate papers in white, textured, or golden frame.',
        40.00,
        'ETB',
        'paper',
        'in_stock',
        1,
        NULL,
        '["A4 Size", "3 Paper Type Options", "Professional Presentation", "Perfect for Awards & Recognition"]'::jsonb,
        '[{"label": "White Hard Paper", "value": "300gsm — ETB 40"}, {"label": "Textured Paper", "value": "250gsm — ETB 60"}, {"label": "Golden Frame Paper", "value": "Premium — ETB 60"}, {"label": "Size", "value": "A4 (29.7cm x 21cm)"}]'::jsonb,
        15
    );
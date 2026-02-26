-- PrintOnline.et v2.0 — Seed: Product Images
-- Maps 35 client-provided images to 15 products
-- Images served from /public/product-images/ (Next.js static)
-- Run AFTER 002_products.sql
-- ============================================================
-- BUSINESS CARDS — 3 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        '/product-images/Business-Card-Design-1.webp',
        'Business card design example with premium finish',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        '/product-images/Business-Card-Design-2.webp',
        'Business card design with modern layout',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'business-cards'
        ),
        '/product-images/Business-Card-Design-3.webp',
        'Business card design with creative typography',
        3,
        false
    );
-- ============================================================
-- LETTERHEAD — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'letterhead'
        ),
        '/product-images/prod_headed_paper_lm_024.jpg',
        'Professional letterhead with company branding',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'letterhead'
        ),
        '/product-images/prod_headed_paper_lm_04.jpg',
        'Letterhead detail showing paper quality',
        2,
        false
    );
-- ============================================================
-- ENVELOPES — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'envelopes'
        ),
        '/product-images/No_10-Envelopes_1400x1400.jpg',
        'Custom branded business envelopes',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'envelopes'
        ),
        '/product-images/10Envelope_NoWindow.jpg',
        'Standard envelope without window',
        2,
        false
    );
-- ============================================================
-- FOLDERS — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        '/product-images/Pocket-Folders_9x1m2.jpg',
        'Branded presentation folder with pocket',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'folders'
        ),
        '/product-images/Pocket_Folders_Business_Advertising_Materials_A.jpg',
        'Presentation folders for business use',
        2,
        false
    );
-- ============================================================
-- FLYERS — 4 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        '/product-images/Flyers (1).jpg',
        'Colorful marketing flyer design',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        '/product-images/Flyers (2).jpg',
        'Corporate flyer with modern layout',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        '/product-images/Flyers (3).jpg',
        'Event promotion flyer example',
        3,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'flyers'
        ),
        '/product-images/Flyers (4).jpg',
        'Product showcase flyer design',
        4,
        false
    );
-- ============================================================
-- BROCHURES — 3 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'brochures'
        ),
        '/product-images/Top-Bi-Fold-Brochure-8.webp',
        'Professional bi-fold brochure design',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'brochures'
        ),
        '/product-images/Top-Bi-Fold-Brochure-10.webp',
        'Corporate brochure with elegant layout',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'brochures'
        ),
        '/product-images/Top-Bi-Fold-Brochure-11.webp',
        'Brochure showcasing full color printing',
        3,
        false
    );
-- ============================================================
-- POSTERS — 4 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '/product-images/Large-Posters_11x17.jpg',
        'Large format poster printing',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '/product-images/Large_Format_Posters_Business_Advertising_Materials_A.jpg',
        'Business advertising poster',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '/product-images/Large_Format_Posters_Marketing_Materials_B.jpg',
        'Marketing materials poster display',
        3,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'posters'
        ),
        '/product-images/Large_Poster_Printing_Thickness_A.jpg',
        'Poster showing paper thickness options',
        4,
        false
    );
-- ============================================================
-- BOOKMARKS — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        '/product-images/BOOK-MARKS-CREATIVE-FORGE-PRINT-scaled.jpg',
        'Creative custom printed bookmarks',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'bookmarks'
        ),
        '/product-images/marketing-card-bookmarks1599709_l.jpg',
        'Marketing bookmarks with brand design',
        2,
        false
    );
-- ============================================================
-- SADDLE-STITCHED BOOKLETS — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'saddle-stitched-booklets'
        ),
        '/product-images/Booklet (1).jpg',
        'Saddle-stitched booklet front cover',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'saddle-stitched-booklets'
        ),
        '/product-images/Booklet (2).jpg',
        'Saddle-stitched booklet showing binding',
        2,
        false
    );
-- ============================================================
-- PERFECT-BOUND BOOKLETS — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'perfect-bound-booklets'
        ),
        '/product-images/Booklet (3).jpg',
        'Perfect-bound booklet with flat spine',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'perfect-bound-booklets'
        ),
        '/product-images/20160504bulkbooklets_1400x1400.jpg',
        'Bulk perfect-bound booklets',
        2,
        false
    );
-- ============================================================
-- WIRE-BOUND (SPIRAL) BOOKLETS — 1 image
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'wire-bound-booklets'
        ),
        '/product-images/Booklet (4).jpg',
        'Wire-bound spiral booklet',
        1,
        true
    );
-- ============================================================
-- NOTEBOOKS — 3 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        '/product-images/5x7JOURNALMAIN-IMAGE2_1400x1400.jpg',
        'Custom branded notebook',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        '/product-images/5x7JOURNALNTBKPRODUCTCOLORS1_450x450.jpg',
        'Notebook available in multiple colors',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'notebooks'
        ),
        '/product-images/5x7JournalNtbkPrintArea2_450x450.jpg',
        'Notebook print area specifications',
        3,
        false
    );
-- ============================================================
-- PAPER STICKER SHEETS — No client images available
-- Will use first available image or placeholder
-- ============================================================
-- (Skipped — no matching images from client. Add via CMS later.)
-- ============================================================
-- PREMIUM GIFT BAGS — 3 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'premium-gift-bags'
        ),
        '/product-images/Full_Color_Paper_Bags_Marketing_Materials_A_Updated.jpg',
        'Custom printed paper gift bags',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'premium-gift-bags'
        ),
        '/product-images/UP_Christmas_Gift_ Bag.png',
        'Premium gift bag with rope handles',
        2,
        false
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'premium-gift-bags'
        ),
        '/product-images/UP_Gift_Bag_Lamination_Spec_Image.png.jpg',
        'Gift bag lamination options',
        3,
        false
    );
-- ============================================================
-- CERTIFICATE PAPER — 2 images
-- ============================================================
INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        display_order,
        is_primary
    )
VALUES (
        (
            SELECT id
            FROM products
            WHERE slug = 'certificate-paper'
        ),
        '/product-images/Award-Certificate-Template-1180x858.jpg',
        'Professional award certificate template',
        1,
        true
    ),
    (
        (
            SELECT id
            FROM products
            WHERE slug = 'certificate-paper'
        ),
        '/product-images/elegant-certificate-template-with-golden-details_69286-459.jpg',
        'Elegant certificate with golden details',
        2,
        false
    );
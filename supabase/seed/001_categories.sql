-- PrintOnline.et v2.0 — Seed: Categories
-- Expanded to 6 categories for better client-facing organization
-- Run FIRST before products seed
INSERT INTO categories (
        name,
        slug,
        description,
        display_order,
        is_active
    )
VALUES -- 1. Business Essentials — cards, letterhead, envelopes, folders
    (
        'Business Essentials',
        'business-essentials',
        'Professional business stationery including business cards, letterheads, envelopes, and presentation folders. Make a lasting first impression with premium quality prints.',
        1,
        true
    ),
    -- 2. Marketing Materials — flyers, brochures, posters, bookmarks
    (
        'Marketing Materials',
        'marketing-materials',
        'Eye-catching marketing collateral to promote your brand. From flyers and brochures to large-format posters and bookmarks.',
        2,
        true
    ),
    -- 3. Booklets & Publications — saddle-stitched, perfect-bound, wire-bound, notebooks
    (
        'Booklets & Publications',
        'booklets-publications',
        'Professional booklets, catalogs, and notebooks with multiple binding options. Perfect for training manuals, company profiles, and event programs.',
        3,
        true
    ),
    -- 4. Stickers & Labels — paper stickers, vinyl stickers, print & cut
    (
        'Stickers & Labels',
        'stickers-labels',
        'Custom printed stickers and labels on paper or vinyl. Available in multiple sizes with optional lamination for durability.',
        4,
        true
    ),
    -- 5. Gifts & Packaging — gift bags, certificates
    (
        'Gifts & Packaging',
        'gifts-packaging',
        'Premium gift bags with custom branding and professional certificate papers. Elevate your packaging and recognition materials.',
        5,
        true
    ),
    -- 6. Specialty Prints — items that don''t fit neatly into other categories (future expansion)
    (
        'Specialty Prints',
        'specialty-prints',
        'Unique and specialty printing products including custom shapes, special materials, and bespoke printing solutions.',
        6,
        true
    );
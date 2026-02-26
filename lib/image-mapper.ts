// lib/image-mapper.ts
// Smart image-to-product mapping utility
// Used for bulk image assignment when filenames follow naming conventions

/**
 * Maps a product name/slug to matching images from a list of filenames.
 * Uses fuzzy keyword matching to find relevant images.
 *
 * @example
 * const images = ['Business-Card-Design-1.webp', 'Flyers (1).jpg'];
 * mapProductImages('business-cards', images) // => ['Business-Card-Design-1.webp']
 */
export function mapProductImages(
  productSlug: string,
  imageFilenames: string[],
): string[] {
  // Build keyword sets for each product
  const keywordMap: Record<string, string[]> = {
    "business-cards": ["business", "card", "bcard"],
    letterhead: ["letterhead", "headed", "paper_lm"],
    envelopes: ["envelope"],
    folders: ["folder", "pocket"],
    flyers: ["flyer"],
    brochures: ["brochure", "bi-fold", "tri-fold", "z-fold"],
    posters: ["poster", "large_format", "large-poster"],
    bookmarks: ["bookmark", "book-mark", "book_mark"],
    "saddle-stitched-booklets": ["booklet"],
    "perfect-bound-booklets": ["booklet", "bulkbooklet"],
    "wire-bound-booklets": ["booklet", "spiral", "wire"],
    notebooks: ["journal", "notebook", "ntbk"],
    "paper-sticker-sheets": ["sticker", "label"],
    "premium-gift-bags": ["gift", "bag", "paper_bag"],
    "certificate-paper": ["certificate", "award", "golden"],
  };

  const keywords = keywordMap[productSlug];
  if (!keywords) return [];

  return imageFilenames.filter((filename) => {
    const lower = filename.toLowerCase();
    return keywords.some((kw) => lower.includes(kw));
  });
}

/**
 * Generates the public URL path for a product image.
 * For local /public files, returns the relative path.
 * For Supabase Storage, returns the full public URL.
 */
export function getProductImageUrl(
  filename: string,
  source: "local" | "supabase" = "local",
  supabaseUrl?: string,
): string {
  if (source === "supabase" && supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`;
  }
  return `/product-images/${encodeURIComponent(filename)}`;
}

/**
 * Generates alt text from image filename by cleaning it up.
 */
export function generateAltText(filename: string, productName: string): string {
  // Remove extension and clean up
  const cleaned = filename
    .replace(/\.[^.]+$/, "") // Remove extension
    .replace(/[_-]+/g, " ") // Replace underscores/hyphens with spaces
    .replace(/\d{3,}x\d{3,}/g, "") // Remove dimensions like 1400x1400
    .replace(/\(\d+\)/g, "") // Remove numbered suffixes like (1)
    .replace(/\s+/g, " ") // Collapse spaces
    .trim();

  return `${productName} - ${cleaned}`;
}

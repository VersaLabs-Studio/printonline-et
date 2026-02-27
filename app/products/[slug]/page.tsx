// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import { getProductBySlug, getAllProductSlugs } from "@/lib/queries/products";
import type { ProductWithDetails } from "@/types/database";

// Generate static params for all products (ISR)
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found | PrintOnline.et",
      description: "The requested product could not be found.",
    };
  }

  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url;

  return {
    title: product.meta_title || `${product.name} | PrintOnline.et`,
    description:
      product.meta_description ||
      product.short_description ||
      product.description ||
      "",
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || "",
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/**
 * Adapt the new DB product shape to the legacy ProductDetailPage component.
 * This bridge keeps the existing UI working while we incrementally
 * migrate ProductDetailPage to consume ProductWithDetails directly.
 */
function adaptProductForLegacyComponent(product: ProductWithDetails) {
  const images = product.product_images.map((img) => img.image_url);
  if (images.length === 0) {
    images.push("/product-images/Business-Card-Design-1.webp");
  }

  const specifications = Array.isArray(product.specifications)
    ? (product.specifications as { label: string; value: string }[])
    : [];

  const features = Array.isArray(product.features)
    ? (product.features as string[])
    : [];

  return {
    id: 0, // Legacy field — not used for routing anymore
    name: product.name,
    category: product.category?.name || "",
    price: product.base_price,
    rating: 5,
    reviews: 0,
    images,
    badge: product.badge || undefined,
    features,
    description: product.description || "",
    inStock: product.in_stock ?? true,
    designStyles: [],
    templates: [],
    specifications,
  };
}

// Main product page (Server Component)
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Bridge to legacy component until ProductDetailPage is modernized
  const legacyProduct = adaptProductForLegacyComponent(product);

  return <ProductDetailPage product={legacyProduct} />;
}

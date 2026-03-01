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

  return <ProductDetailPage product={product} />;
}

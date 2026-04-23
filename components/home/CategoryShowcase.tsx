// components/home/CategoryShowcase.tsx
"use client";

import { CSSFadeIn } from "@/components/shared/SafeMotion";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCategoriesWithCounts } from "@/hooks/data";

const CategoryShowcase = () => {
  const { data: categories, isLoading, error } = useCategoriesWithCounts();

  // Placeholder images per category (fallback until category images are uploaded)
  const categoryImages: Record<string, string> = {
    "business-essentials": "/product-images/Business-Card-Design-1.webp",
    "marketing-materials": "/product-images/Flyers (1).jpg",
    "booklets-publications": "/product-images/Booklet (1).jpg",
    "stickers-labels": "/product-images/Business-Card-Design-2.webp",
    "gifts-packaging":
      "/product-images/Full_Color_Paper_Bags_Marketing_Materials_A_Updated.jpg",
    "specialty-prints": "/product-images/Large-Posters_11x17.jpg",
  };

  return (
    <section className="py-20 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <CSSFadeIn className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            Our Catalog
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Shop by Category
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive range of printing and branding solutions
            suited for every business need.
          </p>
        </CSSFadeIn>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Unable to load categories. Please try again later.</p>
          </div>
        )}

        {/* Categories Grid */}
        {categories && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => {
              const imageUrl =
                category.image_url ||
                categoryImages[category.slug] ||
                "/product-images/Business-Card-Design-1.webp";

              return (
                <CSSFadeIn key={category.id} delay={idx * 100}>
                  <Link
                    href={`/all-products?category=${category.slug}`}
                    className="group relative bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/40 block"
                  >
                    <div className="relative h-56 md:h-72 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>

                      {/* Product count badge */}
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          {category.productCount}{" "}
                          {category.productCount === 1 ? "Item" : "Items"}
                        </span>
                      </div>

                      <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-all duration-500">
                        <div className="translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                            {category.name}
                          </h3>
                          <div className="h-1 w-12 bg-primary mb-3 origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500"></div>

                          <p className="text-gray-300 text-xs mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            {category.description ||
                              `Premium quality ${category.name} solutions.`}
                          </p>

                          <div className="flex items-center text-white font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                            <span className="mr-2">Explore Collection</span>
                            <div className="bg-primary rounded-full p-1 group-hover:translate-x-1 transition-transform">
                              <ArrowRight className="h-3 w-3 text-primary-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CSSFadeIn>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryShowcase;

// components/home/CategoryShowcase.tsx
"use client";

import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
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
        </motion.div>

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
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                >
                  <Link
                    href={`/all-products?category=${category.slug}`}
                    className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/50 block"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                      {/* Product count badge */}
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-white">
                          {category.productCount}{" "}
                          {category.productCount === 1 ? "Product" : "Products"}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <div className="h-0.5 w-12 bg-primary mb-3 origin-left transform scale-x-100 md:scale-x-0 md:group-hover:scale-x-100 transition-transform duration-300"></div>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
                          {category.description}
                        </p>

                        <div className="flex items-center text-white font-bold text-sm md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                          <span className="mr-2">Explore Collection</span>
                          <div className="bg-primary rounded-full p-1">
                            <ArrowRight className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryShowcase;

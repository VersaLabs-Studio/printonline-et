"use client";

import { Heart, Eye, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useFeaturedProducts } from "@/hooks/data";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

const TopSellers = () => {
  const { data: products, isLoading, error } = useFeaturedProducts(4);

  return (
    <section className="py-24 bg-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Top Selling Products
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular printing solutions trusted by thousands of
            businesses for their quality and impact.
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
            <p>Unable to load products. Please try again later.</p>
          </div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => {
              const images = (product as Record<string, unknown>)
                .product_images as
                | { image_url: string; is_primary: boolean }[]
                | undefined;
              const primaryImage = (
                images?.find((img) => img.is_primary) ?? images?.[0]
              )?.image_url;
              const categoryName = product.category?.name || "";

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/40 h-full flex flex-col cursor-pointer">
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        aria-label="Add to wishlist"
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-red-500 shadow-sm"
                      >
                        <Heart className="h-4 w-4" />
                      </button>

                      {/* Image */}
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20">
                            <span className="text-muted-foreground text-sm">
                              {product.name}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 bg-black/60 md:bg-linear-to-t md:from-black/60 md:to-transparent flex gap-2 justify-center pb-6">
                          <span className="bg-white text-black p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg">
                            <Eye className="h-5 w-5" />
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col grow">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                          {categoryName}
                        </p>
                        <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-3">
                          <PriceDisplay
                            amount={product.base_price}
                            variant={
                              product.base_price === 0 ? "from" : "default"
                            }
                            size="sm"
                          />
                        </div>

                        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-center">
                          <span className="text-primary font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/all-products"
              className="btn-pana inline-flex items-center px-8 py-3 rounded-full text-base font-semibold shadow-lg shadow-primary/20"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;

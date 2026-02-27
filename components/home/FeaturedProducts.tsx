"use client";

import { ArrowRight, Sparkles, Shield, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/data";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

const FeaturedProducts = () => {
  // Fetch products that have a badge (Best Seller, Premium, Popular)
  const { data: products, isLoading } = useProducts({ limit: 3 });

  // Filter to only products with a badge for the featured section
  const featuredProducts = (products ?? []).filter((p) => p.badge);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Featured Collections
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Curated Printing Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked products designed to meet your specific business needs
            with premium quality and speed.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Products */}
        {featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => {
              const features = Array.isArray(product.features)
                ? (product.features as string[]).slice(0, 3)
                : [];

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="block h-full"
                  >
                    <div className="relative h-full bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 flex flex-col cursor-pointer">
                      <div className="relative h-72 overflow-hidden">
                        <Image
                          src={`/product-images/${product.slug === "business-cards" ? "Business-Card-Design-1.webp" : product.slug === "flyers" ? "Flyers (1).jpg" : product.slug === "premium-gift-bags" ? "Full_Color_Paper_Bags_Marketing_Materials_A_Updated.jpg" : "Business-Card-Design-1.webp"}`}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex flex-wrap gap-2">
                            {features.map((feature, fIdx) => (
                              <span
                                key={fIdx}
                                className="bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10"
                              >
                                {feature as string}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col grow bg-card">
                        {product.badge && (
                          <span className="inline-flex self-start bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                            {product.badge}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 grow line-clamp-2">
                          {product.short_description || product.description}
                        </p>

                        <div className="mb-4">
                          <PriceDisplay
                            amount={product.base_price}
                            variant={
                              product.base_price === 0 ? "from" : "default"
                            }
                            size="sm"
                          />
                        </div>

                        <div className="pt-4 border-t border-border/50 flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                            View Details
                            <ArrowRight className="h-5 w-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="shrink-0 w-14 h-14 bg-white rounded-xl shadow-xs flex items-center justify-center text-primary border border-primary/10">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium materials and advanced printing technology ensuring
                exceptional, long-lasting results.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="shrink-0 w-14 h-14 bg-white rounded-xl shadow-xs flex items-center justify-center text-primary border border-primary/10">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Fast Delivery
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quick turnaround times with reliable delivery options across all
                of Ethiopia.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="shrink-0 w-14 h-14 bg-white rounded-xl shadow-xs flex items-center justify-center text-primary border border-primary/10">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Custom Design
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional in-house design services to help bring your unique
                creative vision to life.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

// app/all-products/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Grid,
  List,
  ChevronRight,
  Package,
  Sparkles,
  Loader2,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts, useCategories } from "@/hooks/data";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import type { ProductWithCategory } from "@/types/database";

interface ProductCardProps {
  product: ProductWithCategory;
  index: number;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, index, viewMode }: ProductCardProps) => {
  // Get primary image from product_images or fallback
  const images = (product as Record<string, unknown>).product_images as
    | { image_url: string; is_primary: boolean; display_order: number }[]
    | undefined;
  const primaryImage = images?.find((img) => img.is_primary) ?? images?.[0];
  const imageUrl =
    primaryImage?.image_url || "/product-images/Business-Card-Design-1.webp";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <div
          className={`group relative bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${
            viewMode === "list" ? "flex" : ""
          }`}
        >
          {/* Product Image */}
          <div
            className={`relative ${viewMode === "list" ? "w-64 h-64" : "h-64"} overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="w-full btn-pana text-sm py-3 inline-flex items-center justify-center">
                View Details
                <ChevronRight className="h-4 w-4 ml-2" />
              </span>
            </motion.div>
          </div>

          {/* Product Info */}
          <div
            className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}
          >
            <div>
              {product.category && (
                <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">
                  {product.category.name}
                </p>
              )}
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 text-lg">
                {product.name}
              </h3>
              {viewMode === "list" && product.short_description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.short_description}
                </p>
              )}
              <div className="mb-3">
                <PriceDisplay
                  amount={product.base_price}
                  variant={product.base_price === 0 ? "from" : "default"}
                  size="sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    product.in_stock ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm ${
                    product.in_stock ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.in_stock ? "Available" : "Out of Stock"}
                </span>
              </div>

              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-full bg-primary/10 text-primary"
              >
                <Package className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

import { Suspense } from "react";

function AllProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Fetch products from Supabase
  const {
    data: products,
    isLoading,
    error,
  } = useProducts({
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  // Fetch categories for filter
  const { data: categories } = useCategories();

  const totalProducts = products?.length ?? 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-slate-950 flex items-center">
        {/* Animated Background Figures */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              x: [0, -40, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-500/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 z-10"
        >
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white/90 px-5 py-2 rounded-full mb-6 shadow-2xl"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold tracking-wide">
                {totalProducts} Premium Products Available
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-6 tracking-tight"
            >
              Our Collection
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl font-bold"
            >
              Explore our complete range of premium printing solutions.{" "}
              <br className="hidden md:block" /> All prices in Ethiopian Birr
              (ETB).
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative w-full max-w-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-5 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors duration-300 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-lg transition-all duration-300 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 py-4"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Browse All Products
              </h2>
              <p className="text-muted-foreground">
                {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
                found
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory &&
                  ` in ${selectedCategory.replace("-", " ")}`}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="bg-background border border-border rounded-lg flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <List className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading products...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Something went wrong
              </h3>
              <p className="text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products && products.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or category filter.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AllProductsContent />
    </Suspense>
  );
}

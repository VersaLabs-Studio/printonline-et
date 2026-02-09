// app/all-products/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Grid,
  List,
  ChevronRight,
  Package,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Product data organized by letter
const productsByLetter: Record<string, string[]> = {
  A: ["Acrylic Boards", "A-Frame Signs", "Aluminum Boards"],
  B: [
    "Banners",
    "Biz Card Magnets",
    "Blank Letterheads",
    "Booklets",
    "Bookmarks",
    "Brochures",
    "Business Cards",
  ],
  C: [
    "Calendars",
    "Canvas Prints",
    "Car Magnets",
    "Cardboards",
    "Catalogs",
    "Club Flyers",
    "Collectors Cards",
    "Corrugated Boards",
  ],
  D: ["Digital Paper Prints", "Door Hangers"],
  E: ["Envelopes - Custom", "Envelopes - Logo", "Event Tickets"],
  F: [
    "Fabric Prints",
    "Flex Banners",
    "Floor Decals",
    "Flyers",
    "Foam Boards",
    "Folded Biz Cards",
    "Folded Hang Tags",
    "Folders",
    "Framed Prints",
  ],
  G: ["Greeting Cards"],
  H: ["Hang Tags", "Hats"],
  L: ["Letterheads"],
  M: [
    "Metal Wall Prints",
    "Mini Menus",
    "Mounted Wall Prints",
    "Mouse Pads",
    "Mugs",
  ],
  N: ["Notepads"],
  P: [
    "Photo Plaques",
    "Photo Book",
    "Polos",
    "Postcards",
    "Postcard Magnets",
    "Posters - Bulk",
    "Posters - Large Format",
    "Promotional Items",
    "Puzzles",
    "PVC Boards",
  ],
  R: ["Rack Cards", "Retractable Banners", "Rip Cards", "Roll Labels"],
  S: [
    "Signage Solutions",
    "Special Shapes",
    "Staggered Flyers",
    "Stickers",
    "Sweatshirts - Crewnecks",
    "Sweatshirts - Full Zip Hoodies",
    "Sweatshirts - Hoodies",
  ],
  T: ["Table Tents", "T-Shirts"],
  V: ["Vinyl Prints & Wraps"],
  W: ["Window Clings", "Window Decals", "Window Perfs"],
  Y: ["Yard Signs"],
};

// Sample images for placeholders (cycling through available samples)
const getProductImage = (index: number) => {
  const sampleImages = Array.from(
    { length: 30 },
    (_, i) => `/sample${i + 1}.jpg`,
  );
  return sampleImages[index % sampleImages.length];
};

// Helper function to convert product name to slug
const productToSlug = (product: string) => {
  return product
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "");
};

interface ProductCardProps {
  product: string;
  index: number;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, index, viewMode }: ProductCardProps) => {
  const productSlug = productToSlug(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
    >
      <Link href={`/products/${productSlug}`} className="block h-full">
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
                src={getProductImage(index)}
                alt={product}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Hover Overlay Content */}
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

            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                New
              </span>
            </motion.div>
          </div>

          {/* Product Info */}
          <div
            className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}
          >
            <div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 text-lg">
                {product}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Premium quality printing service
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                <span className="text-sm text-green-600">Available</span>
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

interface LetterSectionProps {
  letter: string;
  products: string[];
  viewMode: "grid" | "list";
  startIndex: number;
}

const LetterSection = ({
  letter,
  products,
  viewMode,
  startIndex,
}: LetterSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      {/* Letter Header */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl shadow-lg"
          >
            {letter}
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Products Starting with {letter}
            </h2>
            <p className="text-sm text-muted-foreground">
              {products.length} products available
            </p>
          </div>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
      </motion.div>

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product}
            product={product}
            index={startIndex + index}
            viewMode={viewMode}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default function AllProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Filter products based on search
  const filteredProductsByLetter = useMemo(() => {
    if (!searchQuery.trim()) {
      return productsByLetter;
    }

    const filtered: Record<string, string[]> = {};
    const query = searchQuery.toLowerCase();

    Object.entries(productsByLetter).forEach(([letter, products]) => {
      const filteredProducts = products.filter((product) =>
        product.toLowerCase().includes(query),
      );
      if (filteredProducts.length > 0) {
        filtered[letter] = filteredProducts;
      }
    });

    return filtered;
  }, [searchQuery]);

  // Calculate total products count
  const totalProducts = useMemo(() => {
    return Object.values(filteredProductsByLetter).reduce(
      (sum, products) => sum + products.length,
      0,
    );
  }, [filteredProductsByLetter]);

  // Get available letters
  const availableLetters = Object.keys(filteredProductsByLetter).sort();

  // Calculate start index for each letter section
  let currentIndex = 0;
  const letterStartIndices: Record<string, number> = {};
  Object.keys(productsByLetter).forEach((letter) => {
    letterStartIndices[letter] = currentIndex;
    currentIndex += productsByLetter[letter].length;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/sample1.jpg"
            alt="All Products"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 h-full flex items-center"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                {totalProducts} Products Available
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              All Products
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-200 mb-8 max-w-2xl"
            >
              Explore our complete range of premium printing solutions and
              promotional products. From business cards to large format prints,
              we have everything you need.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative max-w-2xl"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
              />
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
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Letter Filter */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap max-w-md">
                {availableLetters.map((letter) => (
                  <motion.button
                    key={letter}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedLetter(
                        selectedLetter === letter ? null : letter,
                      );
                      document
                        .getElementById(`letter-${letter}`)
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedLetter === letter
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {letter}
                  </motion.button>
                ))}
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

          {/* Products by Letter */}
          {availableLetters.length > 0 ? (
            <div>
              {availableLetters.map((letter) => (
                <div key={letter} id={`letter-${letter}`}>
                  <LetterSection
                    letter={letter}
                    products={filteredProductsByLetter[letter]}
                    viewMode={viewMode}
                    startIndex={letterStartIndices[letter] || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
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
                Try adjusting your search query
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

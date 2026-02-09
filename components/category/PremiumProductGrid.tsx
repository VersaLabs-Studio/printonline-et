// components/category/PremiumProductGrid.tsx
"use client";

import { useState } from "react";
import {
  Heart,
  Eye,
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface PremiumProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
}

const PremiumProductGrid = ({
  products,
  viewMode,
}: PremiumProductGridProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`} className="block">
      <div
        className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${
          viewMode === "list" ? "flex" : ""
        }`}
        onMouseEnter={() => setHoveredProduct(product.id)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`absolute top-4 right-4 z-10 space-y-2`}>
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50"
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4 text-gray-600 hover:text-blue-500 transition-colors" />
          </button>
        </div>

        {/* Product Image */}
        <div
          className={`relative ${viewMode === "list" ? "w-64 h-64" : "h-80"} overflow-hidden bg-gray-50`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
              hoveredProduct === product.id ? "scale-110" : ""
            }`}
          />

          {/* Overlay on Hover */}
          {hoveredProduct === product.id && (
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}

          {/* View Details Button */}
          {hoveredProduct === product.id && (
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="w-full btn-pana text-sm py-3 inline-flex items-center justify-center">
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                {product.category}
              </p>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              {product.description && viewMode === "list" && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* Features */}
          {product.features && viewMode === "list" && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Stock Status and Icons */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Icons */}
            <div className="flex space-x-2">
              {product.badge === "Premium" && (
                <Award className="h-5 w-5 text-yellow-500" />
              )}
              {product.badge === "Express" && (
                <Zap className="h-5 w-5 text-blue-500" />
              )}
              {product.badge === "Guaranteed" && (
                <Shield className="h-5 w-5 text-green-500" />
              )}
              <Truck className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default PremiumProductGrid;

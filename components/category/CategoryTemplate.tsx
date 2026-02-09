// components/category/CategoryTemplate.tsx
"use client";

import { useState } from "react";
import CategoryHero from "./CategoryHero";
import PremiumProductGrid from "./PremiumProductGrid";
import OtherCategories from "./OtherCategories";
import CategoryFeatures from "./CategoryFeatures";
import { Product } from "@/types/product";

interface CategoryTemplateProps {
  categoryData: {
    title: string;
    subtitle: string;
    image: string;
    productCount: number;
    features: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  products: Product[];
}

const CategoryTemplate = ({
  categoryData,
  products,
}: CategoryTemplateProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col">
      <CategoryHero
        title={categoryData.title}
        subtitle={categoryData.subtitle}
        image={categoryData.image}
        productCount={categoryData.productCount}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                All Products
              </h2>
              <p className="text-muted-foreground">
                Showing {products.length} products
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Sort by: Featured</option>
                <option>Name: A to Z</option>
                <option>Name: Z to A</option>
                <option>Newest First</option>
              </select>

              <div className="bg-background border border-border rounded-lg flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""} transition-colors`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""} transition-colors`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <PremiumProductGrid products={products} viewMode={viewMode} />

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg">
                1
              </button>
              <button className="px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                3
              </button>
              <button className="px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                Next
              </button>
            </nav>
          </div>
        </div>
      </section>

      <CategoryFeatures features={categoryData.features} />
      <OtherCategories currentCategory={categoryData.title} />
    </div>
  );
};

export default CategoryTemplate;

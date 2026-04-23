// app/(storefront)/search/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SafeMotionDiv, SafeAnimatePresence } from "@/components/shared/SafeMotion";
import { 
  Search, 
  Package, 
  Loader2, 
  ArrowLeft, 
  LayoutGrid, 
  List as ListIcon,
  Sparkles,
  SearchX,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearch } from "@/hooks/data/useSearch";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import type { ProductWithCategory } from "@/types/database";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: results, isLoading, error } = useSearch(query, 50);

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Hero */}
      <section className="bg-slate-50 border-b border-border/40 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/all-products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <Search size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                  Search Results
                </h1>
              </div>
              <p className="text-slate-500 font-medium">
                Showing results for <span className="text-foreground font-bold">&quot;{query}&quot;</span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-border/40 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/40">Analyzing catalog...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-4">
            <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mx-auto">
              <Package size={32} />
            </div>
            <h2 className="text-xl font-bold italic">Search encountered an error</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">We couldn&apos;t retrieve results at this time. Please try refreshing.</p>
          </div>
        ) : results && results.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
            : "max-w-4xl mx-auto space-y-6"
          }>
            <SafeAnimatePresence mode="popLayout">
              {results.map((product, index) => (
                <SearchResultCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  viewMode={viewMode} 
                />
              ))}
            </SafeAnimatePresence>
          </div>
        ) : (
          <SafeMotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="h-24 w-24 bg-muted/50 rounded-[40px] flex items-center justify-center text-muted-foreground/20 mx-auto mb-8 border-2 border-dashed border-border/20">
              <SearchX size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No matches found</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              We couldn&apos;t find any products matching your search query. Try broadening your terms or explore our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/all-products" className="btn-pana px-8 py-3 text-sm">
                View All Products
              </Link>
              <Link href="/contact" className="px-8 py-3 text-sm font-bold uppercase tracking-widest border border-border rounded-2xl hover:bg-muted transition-all">
                Custom Quote
              </Link>
            </div>
          </SafeMotionDiv>
        )}
      </section>
    </div>
  );
}

function SearchResultCard({ product, index, viewMode }: { product: ProductWithCategory, index: number, viewMode: "grid" | "list" }) {
  const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url || 
                       product.product_images?.[0]?.image_url || 
                       "/placeholder.jpg";

  return (
    <SafeMotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
    >
      <Link href={`/products/${product.slug}`} className="group block h-full">
        <div className={`
          relative bg-white border border-border/40 rounded-3xl overflow-hidden transition-all duration-500
          ${viewMode === "grid" 
            ? "h-full flex flex-col hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1" 
            : "flex gap-6 p-4 hover:bg-muted/30"
          }
        `}>
          {/* Image */}
          <div className={`relative overflow-hidden bg-muted shrink-0 ${viewMode === "grid" ? "aspect-square w-full" : "h-48 w-48 rounded-2xl"}`}>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className={`p-6 flex-1 flex flex-col ${viewMode === "list" ? "justify-center" : ""}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                  {product.category?.name || "Professional"}
                </span>
                <Sparkles size={12} className="text-primary/20" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4">
                {product.short_description || product.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border/10 flex items-center justify-between">
              <PriceDisplay amount={product.base_price} className="text-xl font-bold text-primary" />
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shadow-lg shadow-slate-900/10">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </SafeMotionDiv>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}

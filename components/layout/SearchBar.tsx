"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Command, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/ui/useDebounce";
import { useSearchSuggestions } from "@/hooks/data/useSearch";
import Image from "next/image";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

export function SearchBar({ onSearch }: { onSearch?: () => void }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { data: suggestions, isLoading } = useSearchSuggestions(debouncedQuery);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      inputRef.current?.blur();
      onSearch?.();
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setIsDropdownOpen(false);
    setQuery("");
    router.push(`/products/${slug}`);
    onSearch?.();
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl group">
      <form onSubmit={handleSearch} className="relative z-50">
        <div
          className={`relative flex items-center transition-all duration-500 rounded-2xl overflow-hidden ${
            isFocused ? "ring-4 ring-primary/5 border-primary/40 bg-background" : "bg-muted/30 border-border/40"
          } border shadow-sm`}
        >
          <div className="absolute left-4 flex items-center gap-2">
            <Search
              className={`h-4 w-4 transition-colors duration-300 ${
                isFocused ? "text-primary" : "text-muted-foreground/40"
              }`}
            />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (query.length >= 2) setIsDropdownOpen(true);
            }}
            placeholder="Search professional print solutions..."
            className="w-full h-12 pl-12 pr-24 bg-transparent outline-none text-sm font-bold placeholder:text-muted-foreground/40 placeholder:font-medium"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setQuery("");
                    setIsDropdownOpen(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
            
            <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-border/40 bg-muted/20 text-[10px] font-bold text-muted-foreground/50 transition-opacity duration-300 ${isFocused ? "opacity-0" : "opacity-100"}`}>
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>
      </form>

      {/* Live Results Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-2 z-40 overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Searching catalog...</p>
                </div>
              ) : suggestions && suggestions.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Top Results</span>
                    <Sparkles size={12} className="text-primary/40" />
                  </div>
                  
                    {suggestions.map((product) => {
                      const primaryImage =
                        product.product_images?.find((img) => img.is_primary)
                          ?.image_url ||
                        product.product_images?.[0]?.image_url ||
                        "/placeholder.jpg";

                      return (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.slug)}
                          className="w-full text-left p-3 rounded-xl hover:bg-muted flex items-center gap-4 group transition-all"
                        >
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border border-border/10 shrink-0">
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                                {product.name}
                              </p>
                              {product.category && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40 bg-muted/60 px-1.5 py-0.5 rounded">
                                  {product.category.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 font-medium opacity-60">
                              {product.short_description || product.description}
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <PriceDisplay
                              amount={product.base_price}
                              className="text-xs font-bold text-primary"
                            />
                            <ArrowRight
                              size={12}
                              className="text-muted-foreground/30 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                            />
                          </div>
                        </button>
                      );
                    })}

                  <button
                    onClick={handleSearch}
                    className="w-full mt-2 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary transition-all group"
                  >
                    View All results for &quot;{query}&quot;
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/20">
                    <Search size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-muted-foreground/60">No results found</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Try a different keyword</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle bottom glow when focused */}
      <div
        className={`absolute -bottom-2 left-10 right-10 h-6 bg-primary/20 blur-3xl rounded-full transition-opacity duration-700 pointer-events-none ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}


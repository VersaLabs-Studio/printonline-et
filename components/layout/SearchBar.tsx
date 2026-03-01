"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-xl group">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused ? "scale-[1.02]" : ""
        }`}
      >
        <Search
          className={`absolute left-4 h-4 w-4 transition-colors ${
            isFocused ? "text-primary" : "text-muted-foreground/50"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search professional print solutions..."
          className="w-full h-12 pl-11 pr-12 rounded-2xl bg-muted/30 border border-border/40 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium placeholder:text-muted-foreground/40"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-3 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle bottom glow when focused */}
      <div
        className={`absolute -bottom-2 left-10 right-10 h-4 bg-primary/10 blur-2xl rounded-full transition-opacity duration-300 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      />
    </form>
  );
}

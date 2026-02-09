// components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar: scrolls away */}
      <div
        id="header-top-bar"
        className="bg-background/80 supports-backdrop-filter:bg-background/70 backdrop-blur-sm border-b border-border/30 transition-all duration-300"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Print Online ET Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground leading-none">
                  Print Online ET
                </h1>
                <p className="text-xs text-muted-foreground">
                  powered by Pana Promotion
                </p>
              </div>
            </Link>

            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-6">
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="site-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for prints, banners, vinyls, t-shirt..."
                  className="w-full rounded-full border border-border/60 bg-card py-2.5 pl-10 pr-4 placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  aria-label="Search site"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-secondary/10 transition"
              >
                {mounted &&
                  (theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  ))}
                {!mounted && <Sun className="h-5 w-5 opacity-70" />}
              </button>

              <Link
                href="/account"
                className="p-2 rounded-full hover:bg-secondary/10 transition"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                className="md:hidden p-2 rounded-full hover:bg-secondary/10 transition"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar: sticky on scroll */}
      <div
        id="header-nav-bar"
        className="w-full bg-background/80 supports-backdrop-filter:bg-background/70 backdrop-blur-sm border-b border-border/30 shadow transition-shadow duration-300"
      >
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-between py-3">
            <nav className="flex items-center gap-6">
              <Link
                href="/all-products"
                className="text-foreground hover:text-primary transition-colors font-semibold text-sm"
              >
                All Products
              </Link>
              <Link
                href="/digital-paper-prints"
                className="text-foreground hover:text-primary transition-colors text-sm"
              >
                Digital Paper Prints
              </Link>
              <Link
                href="/signage-solutions"
                className="text-foreground hover:text-primary transition-colors text-sm"
              >
                Signage Solutions
              </Link>
              <Link
                href="/flex-banners"
                className="text-foreground hover:text-primary transition-colors text-sm"
              >
                Flex Banners
              </Link>
              <Link
                href="/vinyl-prints"
                className="text-foreground hover:text-primary transition-colors text-sm"
              >
                Vinyl Prints & Wraps
              </Link>
              <Link
                href="/fabric-prints"
                className="text-foreground hover:text-primary transition-colors text-sm"
              >
                Fabric Prints
              </Link>
              <Link
                href="/promotional-items"
                className="text-foreground hover:text-primary transition-colors text-sm"
              >
                Promotional Items
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/catalog"
                className="btn-pana inline-flex items-center px-4 py-2"
              >
                Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation (collapsible) */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-40">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            <div className="mb-2">
              <label htmlFor="mobile-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-full border border-border/60 bg-card py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            </div>

            <Link
              onClick={toggleMenu}
              href="/all-products"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition font-medium"
            >
              All Products
            </Link>
            <Link
              onClick={toggleMenu}
              href="/digital-paper-prints"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition"
            >
              Digital Paper Prints
            </Link>
            <Link
              onClick={toggleMenu}
              href="/signage-solutions"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition"
            >
              Signage Solutions
            </Link>
            <Link
              onClick={toggleMenu}
              href="/flex-banners"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition"
            >
              Flex Banners
            </Link>
            <Link
              onClick={toggleMenu}
              href="/vinyl-prints"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition"
            >
              Vinyl Prints & Wraps
            </Link>
            <Link
              onClick={toggleMenu}
              href="/fabric-prints"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition"
            >
              Fabric Prints
            </Link>
            <Link
              onClick={toggleMenu}
              href="/promotional-items"
              className="py-2 px-3 rounded-md hover:bg-secondary/10 transition"
            >
              Promotional Items
            </Link>
            <Link
              onClick={toggleMenu}
              href="/catalog"
              className="mt-3 text-center w-full btn-pana inline-flex items-center justify-center px-4 py-2"
            >
              Catalog
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

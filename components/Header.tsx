"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  ChevronRight,
  Home,
  LayoutGrid,
  Package,
} from "lucide-react";
import { useTheme } from "next-themes";
import { SearchBar } from "./layout/SearchBar";
import { CategoryNav } from "./layout/CategoryNav";
import { CartDrawer } from "./layout/CartDrawer";
import { useCategories } from "@/hooks/data/useCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { data: categories } = useCategories();

  useEffect(() => {
    // Avoid setting state synchronously; instead delay setting the mounted state slightly
    // or just let hydration handle it if we only need it to render client-specific UI.
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top tier: Logo + Search + Actions */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/40 py-3 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 transition-transform active:scale-95"
          >
            <div className="relative w-48 h-10 md:w-56 md:h-12">
              <Image
                src="/nav-logo.png"
                alt="PrintOnline.et"
                fill
                className="object-contain object-left dark:brightness-0 dark:invert"
                priority
              />
            </div>
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 justify-center">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-2xl hover:bg-muted transition-all"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            <CartDrawer />

            {/* Account Dropdown - Desktop */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2.5 rounded-2xl hover:bg-muted transition-all">
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer font-semibold"
                      >
                        <Link href="/account">My Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer font-semibold"
                      >
                        <Link href="/account/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer font-semibold text-destructive"
                        onClick={() => signOut()}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer font-semibold"
                      >
                        <Link href="/login" className="flex items-center gap-2">
                          <LogIn size={16} />
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer font-semibold"
                      >
                        <Link
                          href="/register"
                          className="flex items-center gap-2"
                        >
                          <UserPlus size={16} />
                          Create Account
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <button
              className="lg:hidden p-2.5 rounded-2xl hover:bg-muted transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tier: Categories Navigation */}
      <div className="bg-background/90 backdrop-blur-sm border-b border-border/20 py-1.5 hidden lg:block">
        <div className="container mx-auto px-4">
          <CategoryNav />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-background z-50 animate-in slide-in-from-top duration-300 flex flex-col p-6 space-y-8 overflow-y-auto">
          <SearchBar />

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground ml-2 mb-2">
              Navigation
            </span>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Home size={18} />
              </div>
              Home
            </Link>
            <Link
              href="/all-products"
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <LayoutGrid size={18} />
              </div>
              All Products
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground ml-2 mb-2">
              Categories
            </span>
            <div className="grid grid-cols-1 gap-1">
              {categories
                ?.filter((c) => c.is_active)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary group transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {category.name}
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ))}
            </div>
          </div>

          {/* Account Links */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border/20">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground ml-2 mb-2">
              Account
            </span>
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Package size={18} />
                  </div>
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-destructive hover:text-destructive/80 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <div className="mt-auto pb-12 flex flex-col gap-4">
            <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-40">
              Professional Print Solutions • Addis Ababa
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

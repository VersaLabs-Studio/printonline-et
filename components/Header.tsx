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
} from "lucide-react";
import { useTheme } from "next-themes";
import { SearchBar } from "./layout/SearchBar";
import { CategoryNav } from "./layout/CategoryNav";
import { CartDrawer } from "./layout/CartDrawer";
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

  useEffect(() => {
    setMounted(true);
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
      <div className="bg-background/90 backdrop-blur-sm border-b border-border/20 py-1.5 hidden lg:block overflow-hidden">
        <div className="container mx-auto px-4">
          <CategoryNav />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-background z-50 animate-in slide-in-from-top duration-300 flex flex-col p-6 space-y-8">
          <SearchBar />
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2">
              Categories
            </span>
            <Link
              href="/"
              className="px-2 py-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <CategoryNav />
          </div>

          {/* Auth Links - Mobile */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2">
              Account
            </span>
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 text-sm font-bold uppercase tracking-wider text-destructive hover:text-destructive/80 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <div className="mt-auto pb-12 flex flex-col gap-4">
            <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
              Professional Print Solutions • Addis Ababa
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

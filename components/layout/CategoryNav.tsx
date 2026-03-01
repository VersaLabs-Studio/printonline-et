"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/data/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function CategoryNav() {
  const { data: categories, isLoading } = useCategories();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
      <NavLink href="/" active={pathname === "/"}>
        Home
      </NavLink>
      <NavLink href="/all-products" active={pathname === "/all-products"}>
        All Products
      </NavLink>
      {categories
        ?.filter((c) => c.is_active)
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((category) => (
          <NavLink
            key={category.id}
            href={`/categories/${category.slug}`}
            active={pathname === `/categories/${category.slug}`}
          >
            {category.name}
          </NavLink>
        ))}
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "text-muted-foreground hover:text-primary hover:bg-primary/5",
      )}
    >
      {children}
    </Link>
  );
}

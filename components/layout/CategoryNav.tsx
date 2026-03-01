"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/data/useCategories";
import { useProducts } from "@/hooks/data/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ExternalLink } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

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
    <nav className="flex items-center gap-1 overflow-visible py-1 relative z-50">
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
          <MegaMenuCategory
            key={category.id}
            category={category}
            active={pathname === `/categories/${category.slug}`}
          />
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

function MegaMenuCategory({
  category,
  active,
}: {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  active: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap inline-flex items-center gap-1",
          active || isHovered
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "text-muted-foreground hover:text-primary hover:bg-primary/5",
        )}
      >
        {category.name}
      </Link>

      {/* Mega Menu Dropdown Plane */}
      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-in-out origin-top",
          isHovered
            ? "opacity-100 visible scale-100 translate-y-0"
            : "opacity-0 invisible scale-95 -translate-y-2 pointer-events-none",
        )}
      >
        <div className="w-[800px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden p-6 grid grid-cols-12 gap-8 relative">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="col-span-3 space-y-4 relative z-10 border-r border-border/20 pr-6">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                {category.description ||
                  `Browse our entire premium collection of ${category.name}.`}
              </p>
            </div>
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors mt-6 group/link"
            >
              View Catalog{" "}
              <ChevronRight
                size={14}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="col-span-9 relative z-10">
            {isHovered && <MegaMenuProducts categorySlug={category.slug} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function MegaMenuProducts({ categorySlug }: { categorySlug: string }) {
  const { data: products, isLoading } = useProducts({
    categorySlug,
    // Removed limit to show all products
    sortBy: "display_order",
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 h-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl w-full bg-muted/20" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground/50 border-2 border-dashed border-border/30 rounded-2xl">
        Catalog Updating
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto pr-2">
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => {
          const primaryImage =
            product.product_images?.find((img) => img.is_primary)?.image_url ||
            product.product_images?.[0]?.image_url ||
            "/placeholder.jpg";

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group/product flex flex-col gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40"
            >
              <div className="relative h-32 w-full rounded-xl overflow-hidden bg-muted/20">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/product:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <ExternalLink className="text-white h-6 w-6" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground line-clamp-1 uppercase tracking-tight group-hover/product:text-primary transition-colors">
                  {product.name}
                </h4>
                <PriceDisplay
                  amount={product.base_price}
                  className="text-[10px]"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

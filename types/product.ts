// types/product.ts
// ⚠️ DEPRECATED — Legacy type kept for backward compatibility with
// components/category/CategoryTemplate.tsx and PremiumProductGrid.tsx
// New code should use types from types/database.ts instead.

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  badge?: string;
  features?: string[];
  description: string;
  inStock: boolean;
  discount?: number;
  designStyles: string[];
  templates: string[];
  specifications: {
    label: string;
    value: string;
  }[];
}

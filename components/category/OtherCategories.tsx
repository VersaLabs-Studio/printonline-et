// components/category/OtherCategories.tsx
"use client";

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  link: string;
}

interface OtherCategoriesProps {
  currentCategory: string;
}

const OtherCategories = ({ currentCategory }: OtherCategoriesProps) => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Digital Paper Prints",
      description: "Business cards, flyers, brochures, and more",
      image: "/sample11.jpg",
      productCount: 500,
      link: "/digital-paper-prints"
    },
    {
      id: 2,
      name: "Signage Solutions",
      description: "Indoor and outdoor signage for maximum impact",
      image: "/sample12.jpg",
      productCount: 200,
      link: "/signage-solutions"
    },
    {
      id: 3,
      name: "Flex Banners",
      description: "Durable banners for events and promotions",
      image: "/sample13.jpg",
      productCount: 150,
      link: "/flex-banners"
    },
    {
      id: 4,
      name: "Vinyl Prints & Wraps",
      description: "Vehicle wraps and custom vinyl graphics",
      image: "/sample14.jpg",
      productCount: 300,
      link: "/vinyl-prints"
    },
    {
      id: 5,
      name: "Fabric Prints",
      description: "Custom fabric printing for events and textiles",
      image: "/sample15.jpg",
      productCount: 180,
      link: "/fabric-prints"
    },
    {
      id: 6,
      name: "Promotional Items",
      description: "Branded merchandise and corporate gifts",
      image: "/sample16.jpg",
      productCount: 400,
      link: "/promotional-items"
    }
  ];

  const filteredCategories = categories.filter(cat => cat.name !== currentCategory);

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Other Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover more printing solutions for your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Product count badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-foreground">{category.productCount} Products</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                
                <div className="flex items-center text-primary font-bold">
                  <span>Shop Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherCategories;
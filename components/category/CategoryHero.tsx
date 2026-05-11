// components/category/CategoryHero.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import Image from 'next/image';

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  image: string;
  images?: { url: string; alt_text?: string | null }[];
  productCount: number;
}

const SLIDESHOW_INTERVAL = 5000;

const CategoryHero = ({ title, subtitle, image, images, productCount }: CategoryHeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentIdx, setCurrentIdx] = useState(0);

  const slideshowImages = images && images.length > 0
    ? images
    : image
      ? [{ url: image, alt_text: title }]
      : [];

  const hasMultiple = slideshowImages.length > 1;

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % slideshowImages.length);
  }, [slideshowImages.length]);

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(nextSlide, SLIDESHOW_INTERVAL);
    return () => clearInterval(timer);
  }, [hasMultiple, nextSlide]);

  if (slideshowImages.length === 0) return null;

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image Slideshow */}
      {slideshowImages.map((img, idx) => (
        <div
          key={img.url}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: idx === currentIdx ? 1 : 0 }}
        >
          <Image
            src={img.url}
            alt={img.alt_text || title}
            fill
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
              {productCount} Products Available
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            {subtitle}
          </p>
          
          {/* Slide Indicators */}
          {hasMultiple && (
            <div className="flex gap-2 mb-6">
              {slideshowImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIdx
                      ? "w-8 bg-white"
                      : "w-3 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            
            <div className="flex gap-2">
              <button className="bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-colors inline-flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              <div className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-white/30' : ''} transition-colors`}
                >
                  <Grid className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-white/30' : ''} transition-colors`}
                >
                  <List className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;

"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const slides = [
    {
      id: 1,
      title: "Professional Printing Solutions",
      subtitle: "High-quality prints for your business needs",
      image: "/sample1.jpg",
    },
    {
      id: 2,
      title: "Custom Branding Materials",
      subtitle: "Stand out with personalized designs",
      image: "/sample2.jpg",
    },
    {
      id: 3,
      title: "Premium Promotional Items",
      subtitle: "Elevate your brand presence",
      image: "/sample3.jpg",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide((s) => (s + 1) % slides.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative h-[600px] md:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="wait">
          {slides.map(
            (slide, idx) =>
              idx === currentSlide && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {/* Content with micro interactions */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          key={currentSlide}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
        >
          <div className="max-w-2xl text-white">
            <div className="flex items-center space-x-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-sm">4.9/5 from 2,000+ reviews</span>
            </div>

            <motion.h1
              layout
              transition={{ type: "spring", stiffness: 90 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              animate={{ opacity: 1 }}
              className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Order Now Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/all-products"
                className="btn-pana py-4 px-8 text-lg font-semibold inline-flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              >
                <span className="relative">
                  Order Now
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/50 rounded-full"></span>
                </span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

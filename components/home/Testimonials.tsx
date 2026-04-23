// components/home/Testimonials.tsx
"use client";

import { useState } from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { SafeMotionDiv, SafeAnimatePresence } from "@/components/shared/SafeMotion";

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Marketing Director, TechCorp",
      avatar: "/sample17.jpg",
      rating: 5,
      text: "Outstanding quality and service! Our new business cards and brochures look professional and have received numerous compliments. The team was helpful throughout the entire process.",
      project: "Business Cards & Brochures",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "CEO, StartupHub",
      avatar: "/sample18.jpg",
      rating: 5,
      text: "Fast delivery and exceptional print quality. We needed event materials on short notice and they delivered beyond our expectations. Will definitely use their services again.",
      project: "Event Branding Package",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Operations Manager, RetailCo",
      avatar: "/sample19.jpg",
      rating: 5,
      text: "The vehicle wraps transformed our company vans into moving billboards. The quality is exceptional and the colors are vibrant even after months of exposure.",
      project: "Vehicle Wraps",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-br from-primary/5 to-secondary/5 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>

        <SafeMotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of businesses across Ethiopia for our
            reliability, quality, and exceptional service.
          </p>
        </SafeMotionDiv>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Main testimonial */}
          <div className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border/50 relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Quote className="h-32 w-32 text-primary rotate-12" />
            </div>

            <div className="p-6 md:p-16 min-h-[400px] flex flex-col justify-center">
              <SafeAnimatePresence mode="wait">
                <SafeMotionDiv
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12"
                >
                  <div className="shrink-0">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-primary/10">
                      <Image
                        src={testimonials[activeTestimonial].avatar}
                        alt={testimonials[activeTestimonial].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-6">
                      {[...Array(testimonials[activeTestimonial].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-6 w-6 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>

                    <blockquote className="text-xl md:text-2xl text-foreground mb-8 italic leading-relaxed">
                      &quot;{testimonials[activeTestimonial].text}&quot;
                    </blockquote>

                    <div>
                      <h4 className="font-bold text-xl text-foreground">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-muted-foreground">
                        {testimonials[activeTestimonial].company}
                      </p>
                      <div className="inline-flex items-center mt-3 px-3 py-1 rounded-full bg-secondary text-xs font-bold text-secondary-foreground border border-border">
                        Project: {testimonials[activeTestimonial].project}
                      </div>
                    </div>
                  </div>
                </SafeMotionDiv>
              </SafeAnimatePresence>
            </div>
          </div>

          {/* Testimonial navigation */}
          <div className="flex justify-center space-x-4 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`transition-all duration-300 rounded-full ${
                  activeTestimonial === index
                    ? "w-10 h-3 bg-primary shadow-lg shadow-primary/30"
                    : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <SafeMotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-border/40 pt-12"
        >
          <div className="text-center group hover:transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
              98%
            </p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Customer Satisfaction
            </p>
          </div>
          <div className="text-center group hover:transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
              4.9/5
            </p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Average Rating
            </p>
          </div>
          <div className="text-center group hover:transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
              2K+
            </p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Reviews
            </p>
          </div>
          <div className="text-center group hover:transform hover:-translate-y-1 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
              85%
            </p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Return Customers
            </p>
          </div>
        </SafeMotionDiv>
      </div>
    </section>
  );
};

export default Testimonials;

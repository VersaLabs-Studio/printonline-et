"use client";

import { Clock, Tag, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Flash Sale",
      subtitle: "Business Cards",
      description: "Premium quality business cards with custom designs",
      image: "/sample20.jpg",
      expires: "2 days left",
      bgColor: "bg-red-500",
      link: "/products/premium-business-cards",
    },
    {
      id: 2,
      title: "Bundle Deal",
      subtitle: "Complete Branding Package",
      description: "Get logo, business cards, and letterheads together",
      image: "/sample21.jpg",
      expires: "5 days left",
      bgColor: "bg-blue-500",
      link: "/digital-paper-prints",
    },
    {
      id: 3,
      title: "Limited Time",
      subtitle: "Banner Printing",
      description: "Large format banners for events and promotions",
      image: "/sample22.jpg",
      expires: "1 week left",
      bgColor: "bg-green-500",
      link: "/flex-banners",
    },
  ];

  return (
    <section className="py-16 hidden lg:block">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full mb-4">
            <Tag className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold text-red-500">
              Limited Time Offers
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4">
            Special Deals & Promotions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t miss out on these amazing deals for your printing needs
          </p>
        </div>

        {/* Offers */}
        <div className="grid grid-cols-3 gap-8">
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.02, rotate: 0.3 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <Link href={offer.link} className="block">
                <div className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <div className="relative h-72 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Badge */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * offer.id }}
                    >
                      <div
                        className={`absolute top-4 left-4 ${offer.bgColor} text-white px-4 py-2 rounded-lg`}
                      >
                        <p className="text-lg font-bold">Special Offer</p>
                      </div>
                    </motion.div>

                    {/* Timer */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-bold">
                          {offer.expires}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{offer.title}</h3>
                      <p className="text-xl mb-2">{offer.subtitle}</p>
                      <p className="text-sm text-white/80">
                        {offer.description}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-full btn-pana text-lg py-3 inline-flex items-center justify-center gap-2"
                  >
                    View Offer
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Social proof */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-6 py-3 rounded-full">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary">
              Join thousands of customers with our deals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;

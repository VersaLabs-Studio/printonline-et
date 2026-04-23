// app/page.tsx
import dynamic from "next/dynamic";

// Above-the-fold: Load immediately
import { HeroSection, TopSellers } from "@/components/home";

// Below-the-fold: Lazy load with skeleton placeholders
const HowItWorks = dynamic(
  () => import("@/components/home").then((mod) => ({ default: mod.HowItWorks })),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const FeaturedProducts = dynamic(
  () => import("@/components/home").then((mod) => ({ default: mod.FeaturedProducts })),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const CategoryShowcase = dynamic(
  () => import("@/components/home").then((mod) => ({ default: mod.CategoryShowcase })),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const SpecialOffers = dynamic(
  () => import("@/components/home").then((mod) => ({ default: mod.SpecialOffers })),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const Testimonials = dynamic(
  () => import("@/components/home").then((mod) => ({ default: mod.Testimonials })),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const NewsLettersSignup = dynamic(
  () => import("@/components/home").then((mod) => ({ default: mod.NewsLettersSignup })),
  {
    loading: () => <div className="h-64 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Above the fold - Load immediately */}
      <HeroSection />
      <TopSellers />
      
      {/* Below the fold - Lazy loaded */}
      <HowItWorks />
      <FeaturedProducts />
      <CategoryShowcase />
      <SpecialOffers />
      <Testimonials />
      <NewsLettersSignup />
    </main>
  );
}

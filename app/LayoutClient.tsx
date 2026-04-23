// app/LayoutClient.tsx (Client Component)
"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { CartProvider } from "@/context/CartContext";
import { usePathname } from "next/navigation";

// Lazy load heavy components
const Toaster = dynamic(
  () => import("sonner").then((mod) => ({ default: mod.Toaster })),
  { ssr: false }
);

const Header = dynamic(() => import("@/components/Header"), {
  ssr: true,
  loading: () => <div className="h-16 bg-background" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <div className="h-32 bg-background" />,
});

export default function LayoutClient({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const pathname = usePathname();

  // Hide public header/footer on CMS and Auth routes
  const isCMS = pathname?.startsWith("/cms");
  const isAuth =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password");

  const hidePublicLayout = isCMS || isAuth;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <CartProvider>
          {!hidePublicLayout && <Header />}
          <main className={!hidePublicLayout ? "min-h-screen" : ""}>
            {children}
          </main>
          {!hidePublicLayout && <Footer />}
          <Toaster position="top-right" richColors closeButton />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

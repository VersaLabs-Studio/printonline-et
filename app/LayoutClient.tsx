// app/LayoutClient.tsx (Client Component)
"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { CartProvider } from "@/context/CartContext";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// app/layout.tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import LayoutClient from "./LayoutClient";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Print Online Ethiopia",
  description: "Leading printing and branding solutions in Ethiopia.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://printonline.et"
  ),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable}`}>
      <body className="font-sans antialiased text-foreground selection:bg-primary/30">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}

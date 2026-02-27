import React from "react";
import { CMSSidebar } from "@/components/cms/layout/CMSSidebar";
import { CMSHeader } from "@/components/cms/layout/CMSHeader";

export const metadata = {
  title: "CMS Admin | PrintOnline.et",
  description: "PrintOnline.et v2.0 Management System",
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop Only for now as per mobile-first priority but usually CMS needs sidebar */}
      <CMSSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen transition-all duration-300 ease-in-out pl-16 md:pl-16 lg:pl-64">
        <CMSHeader />

        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <footer className="p-6 text-center text-xs text-muted-foreground border-t border-border/50 bg-card">
          &copy; {new Date().getFullYear()} PrintOnline.et — Powered by Pana
          Promotion
        </footer>
      </div>
    </div>
  );
}

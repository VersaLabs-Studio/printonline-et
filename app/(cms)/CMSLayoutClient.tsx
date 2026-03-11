"use client";

import React, { useState } from "react";
import { CMSSidebar } from "@/components/cms/layout/CMSSidebar";
import { CMSHeader } from "@/components/cms/layout/CMSHeader";

export function CMSLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <CMSSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen transition-all duration-300 ease-in-out lg:pl-64">
        <CMSHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <footer className="p-6 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t border-border/50 bg-card">
          &copy; {new Date().getFullYear()} PrintOnline.et — Powered by Pana
          Promotion
        </footer>
      </div>
    </div>
  );
}

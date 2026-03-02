// app/(account)/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, LogOut, ChevronRight, UserCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

const navItems = [
  {
    title: "Account Dashboard",
    href: "/account",
    icon: UserCircle,
  },
  {
    title: "Order History",
    href: "/orders",
    icon: Package,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-10">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop / Top Nav - Mobile */}
          <aside className="w-full lg:w-72 space-y-4 md:space-y-6">
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 md:p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                  <User size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-foreground text-sm md:text-base truncate">
                    {isPending ? "Loading..." : session?.user?.name || "User"}
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground truncate opacity-70">
                    {session?.user?.email}
                  </span>
                </div>
              </div>

              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide -mx-1 px-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between group px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={18}
                          className={cn(
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-primary",
                          )}
                        />
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={cn(
                          "hidden lg:block transition-transform duration-200",
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                        )}
                      />
                    </Link>
                  );
                })}

                <div className="lg:pt-4 lg:mt-4 lg:border-t lg:border-border/50 shrink-0 lg:shrink flex lg:block">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-200 whitespace-nowrap"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Quick Support - Hidden on small mobile, show on medium+ */}
            <div className="hidden md:block bg-pana-gradient p-6 rounded-2xl text-primary-foreground overflow-hidden relative group shadow-lg shadow-primary/10">
              <div className="relative z-10">
                <h3 className="font-bold mb-1">Need Help?</h3>
                <p className="text-xs opacity-90 mb-4 leading-relaxed line-clamp-2">
                  Our support team is ready to help you with your printing
                  needs.
                </p>
                <Link
                  href="/contact"
                  className="text-[10px] font-bold bg-white text-black px-4 py-2 rounded-full inline-block hover:bg-primary transition-all hover:text-white"
                >
                  Contact Us
                </Link>
              </div>
              <Package className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 lg:w-72 space-y-6">
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={24} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-foreground truncate">
                    {isPending ? "Loading..." : session?.user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {session?.user?.email}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
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
                          "transition-transform duration-200",
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                        )}
                      />
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-border/50">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Quick Support / Promotion Card */}
            <div className="bg- Pana gradient bg- pana-gradient p-6 rounded-2xl text-primary-foreground overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="font-bold mb-1">Need Help?</h3>
                <p className="text-xs opacity-90 mb-4 leading-relaxed">
                  Our support team is ready to help you with your printing
                  needs.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-bold bg-white text-black px-4 py-2 rounded-full inline-block hover:bg-opacity-90 transition-colors"
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

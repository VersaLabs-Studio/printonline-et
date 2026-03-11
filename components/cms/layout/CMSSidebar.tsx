"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Settings,
  ChevronLeft,
  ExternalLink,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

function NavItem({ href, icon: Icon, label, active, collapsed }: NavItemProps) {
  return (
    <Link href={href} className="block">
      <span
        className={cn(
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 group relative",
          active
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon
          size={18}
          className={cn(
            "transition-colors duration-300",
            active ? "text-primary-foreground" : "group-hover:text-primary",
          )}
        />
        {!collapsed && (
          <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">
            {label}
          </span>
        )}
        {collapsed && (
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-card text-foreground text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl border border-border/50 whitespace-nowrap">
            {label}
          </div>
        )}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary-foreground rounded-r-full" />
        )}
      </span>
    </Link>
  );
}

interface CMSSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CMSSidebar({ isOpen, onClose }: CMSSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigation = [
    { href: "/cms", icon: BarChart3, label: "Overview" },
    { href: "/cms/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/cms/products", icon: Package, label: "Products" },
    { href: "/cms/customers", icon: Users, label: "Customers" },
    { href: "/cms/categories", icon: Layers, label: "Categories" },
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 bg-card border-r border-border/40 z-50 transition-all duration-500 ease-in-out flex flex-col shadow-sm",
        collapsed ? "w-20" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="h-20 flex items-center px-6 border-b border-border/40 bg-muted/5">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
            <span className="font-bold text-xl italic">P</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left duration-500">
              <span className="font-bold text-xs tracking-tight uppercase leading-none text-foreground">
                PrintOnline
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1 opacity-70">
                PANA ADMIN
              </span>
            </div>
          )}
        </div>
        {/* Mobile Close */}
        {isOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden ml-auto rounded-full"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-8 px-4 space-y-6">
        <div>
          <div
            className={cn(
              "px-3 mb-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-50",
              collapsed && "hidden",
            )}
          >
            Management
          </div>
          <div className="space-y-1.5">
            {navigation.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={
                  pathname === item.href ||
                  (item.href !== "/cms" && pathname.startsWith(item.href))
                }
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>

        <div>
          <div
            className={cn(
              "px-3 mb-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-50",
              collapsed && "hidden",
            )}
          >
            Terminal
          </div>
          <div className="space-y-1.5">
            <NavItem
              href="/cms/settings"
              icon={Settings}
              label="Settings"
              active={pathname === "/cms/settings"}
              collapsed={collapsed}
            />
            <NavItem
              href="/"
              icon={ExternalLink}
              label="Live Site"
              collapsed={collapsed}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/10">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            "w-full rounded-xl transition-all duration-300",
            collapsed ? "h-12" : "h-12 justify-start px-4 gap-4",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold uppercase tracking-widest text-[10px]",
          )}
          onClick={handleSignOut}
        >
          <LogOut size={18} />
          {!collapsed && <span>System Logout</span>}
        </Button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 w-full h-8 flex items-center justify-center rounded-xl bg-muted/30 hover:bg-muted text-muted-foreground/60 hover:text-primary transition-all active:scale-95 border border-border/20"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}

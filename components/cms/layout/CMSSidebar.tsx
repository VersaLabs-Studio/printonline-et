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
    <Link href={href}>
      <span
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon
          size={20}
          className={cn(
            active ? "text-primary-foreground" : "group-hover:text-primary",
          )}
        />
        {!collapsed && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
            {label}
          </span>
        )}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-md border whitespace-nowrap">
            {label}
          </div>
        )}
      </span>
    </Link>
  );
}

export function CMSSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigation = [
    { href: "/cms", icon: BarChart3, label: "Dashboard" },
    { href: "/cms/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/cms/products", icon: Package, label: "Products" },
    { href: "/cms/customers", icon: Users, label: "Customers" },
    { href: "/cms/categories", icon: Layers, label: "Categories" },
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 bg-card border-r border-border/50 z-40 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 shadow-lg shadow-primary/20">
            <span className="font-bold">P</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-tight">
                PrintOnline CMS
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Pana Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1">
        <div
          className={cn(
            "px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
            collapsed && "opacity-0",
          )}
        >
          Main Menu
        </div>
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
            collapsed={collapsed}
          />
        ))}

        <div className="pt-4 mt-4 border-t border-border/50">
          <div
            className={cn(
              "px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
              collapsed && "opacity-0",
            )}
          >
            System
          </div>
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
            label="View Storefront"
            collapsed={collapsed}
          />
        </div>
      </div>

      {/* User / Bottom Actions */}
      <div className="p-3 border-t border-border/50 bg-muted/20">
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </Button>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
          </Button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted text-muted-foreground active:scale-95 transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

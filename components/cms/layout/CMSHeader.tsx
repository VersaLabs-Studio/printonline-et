"use client";

import React from "react";
import { Bell, Search, User, Menu, ChevronRight, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CMSHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  // Generate breadcrumbs from pathname
  const paths = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border/50 z-30 flex items-center justify-between px-6 transition-all">
      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Global CMS search (e.g. order # or product)..."
          className="pl-10 bg-muted/50 border-transparent focus:bg-card focus:border-border transition-all"
        />
      </div>

      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/20">
          P
        </div>
        <span className="font-bold text-sm tracking-tight leading-tight">
          PrintOnline CMS
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/" target="_blank">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-9 w-9 rounded-full hover:bg-muted"
            title="View Storefront"
          >
            <Globe className="h-5 w-5" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground h-9 w-9 rounded-full relative hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </Button>

        <div className="h-8 w-px bg-border/50 mx-1"></div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 gap-3 px-2 rounded-full hover:bg-muted transition-all"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || "Admin"}
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                  {session?.user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-bold leading-none">
                  {session?.user?.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                  System Admin
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">
                  {session?.user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/cms/profile">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cms/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>System Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/login";
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function Settings({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

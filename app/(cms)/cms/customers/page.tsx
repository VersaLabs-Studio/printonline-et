"use client";

import React from "react";
import { useCustomers, CustomerWithStats } from "@/hooks/data/useCustomers";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  User,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function CMSCustomersPage() {
  const { data: customers, isLoading, error } = useCustomers();

  const columns: ColumnDef<CustomerWithStats>[] = [
    {
      accessorKey: "full_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shadow-sm">
            {row.original.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-foreground">
              {row.original.full_name}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
              Registered Member
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
            <Mail size={12} className="text-muted-foreground" /> {row.original.email}
          </div>
          {row.original.phone && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground tracking-tight">
              <Phone size={10} className="text-muted-foreground" />{" "}
              {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "company_name",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold">
            {row.original.company_name || "Personal"}
          </span>
          {row.original.tin_number && (
            <span className="text-[10px] text-muted-foreground font-mono">
              TIN: {row.original.tin_number}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "total_orders",
      header: "Volume",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit text-[10px] font-bold py-0 h-5 px-2 bg-primary/5 text-primary border-primary/10">
            {row.original.total_orders} Orders
          </Badge>
          {row.original.last_order_date && (
            <span className="text-[9px] text-muted-foreground font-bold uppercase mt-1">
              Last: {format(new Date(row.original.last_order_date), "MMM d, yyyy")}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "MMM yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-primary/5 rounded-full transition-all text-muted-foreground hover:text-primary"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 rounded-xl shadow-xl border-border/40 p-1.5"
          >
            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-1.5">
              Customer Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer font-bold text-xs gap-3 py-2.5"
            >
              <Link href={`/cms/customers/${row.original.id}`}>
                <Eye className="h-4 w-4 text-primary" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer font-bold text-xs gap-3 py-2.5"
            >
              <Link href={`/cms/orders?customer=${row.original.id}`}>
                <ExternalLink className="h-4 w-4 text-primary" /> Order History
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Customers"
        subtitle="Manage your registered customer base and their profiles."
        breadcrumbs={[{ label: "Customers" }]}
        actions={
          <Button
            variant="outline"
            className="rounded-xl gap-2 font-bold border-border/60"
          >
            <User size={18} className="text-primary" />
            Export Directory
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="p-20 text-center bg-destructive/5 rounded-3xl border border-destructive/10">
          <p className="text-destructive font-bold text-lg">
            Failed to sync customer directory.
          </p>
          <Button
            variant="secondary"
            className="mt-4 rounded-xl"
            onClick={() => window.location.reload()}
          >
            Re-sync Data
          </Button>
        </div>
      ) : (
        <CMSDataTable
          columns={columns}
          data={customers || []}
          searchPlaceholder="Search by name, email or company..."
        />
      )}
    </div>
  );
}

"use client";

import React from "react";
import { useCustomers } from "@/hooks/data/useCustomers";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CMSCustomersPage() {
  const { data: customers, isLoading, error } = useCustomers();

  const columns: ColumnDef<CustomerProfile>[] = [
    {
      accessorKey: "full_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
              {row.original.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{row.original.full_name}</span>
            <span className="text-[11px] text-muted-foreground">
              {row.original.company_name || "Individual"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={12} className="text-primary/60" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone size={12} className="text-primary/60" />
            {row.original.phone || "No phone"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "tin_number",
      header: "TIN Number",
      cell: ({ row }) =>
        row.original.tin_number ? (
          <code className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono font-bold tracking-widest text-foreground/80">
            {row.original.tin_number}
          </code>
        ) : (
          <span className="text-xs text-muted-foreground italic">N/A</span>
        ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/cms/customers/${customer.id}`}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" /> Email Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Customers"
        subtitle="Manage customer profiles and business details."
        breadcrumbs={[{ label: "Customers" }]}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
          <p className="text-destructive font-bold">
            Failed to load customers.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <CMSDataTable
          columns={columns}
          data={customers || []}
          searchPlaceholder="Search customers by name or company..."
        />
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  User as UserIcon, 
  MoreVertical, 
  ShieldAlert, 
  Mail, 
  Calendar,
  Lock
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string | null;
  created_at: string;
  phone: string | null;
  company_name: string | null;
}

export default function CMSTeamPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string, name: string, role: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/cms/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch {
      toast.error("Failed to load team members");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/cms/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("User role updated successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to update user role");
    } finally {
      setPendingUpdate(null);
    }
  };

  const columns: ColumnDef<UserRecord>[] = [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">{row.original.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Joined {format(new Date(row.original.created_at), "MMM yyyy")}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Access Credentials",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
            <Mail size={12} className="text-muted-foreground" />
            {row.original.email}
          </div>
          {row.original.phone && (
            <div className="text-[10px] text-muted-foreground font-mono">
              {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Security Level",
      cell: ({ row }) => {
        const role = row.original.role || "customer";
        const isAdmin = role === "admin";
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border-2",
              isAdmin 
                ? "bg-primary/5 border-primary/20 text-primary" 
                : "bg-muted/50 border-border/40 text-muted-foreground"
            )}
          >
            {isAdmin ? <ShieldCheck size={12} className="mr-1.5" /> : <UserIcon size={12} className="mr-1.5" />}
            {role}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const role = row.original.role || "customer";
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/40 shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">
                  Access Control
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role !== "admin" ? (
                  <DropdownMenuItem 
                    className="text-xs font-semibold gap-2 py-2.5 px-3 focus:bg-primary/10 focus:text-primary cursor-pointer"
                    onClick={() => setPendingUpdate({ id: row.original.id, name: row.original.name, role: "admin" })}
                  >
                    <ShieldCheck size={14} /> Promote to Admin
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    className="text-xs font-semibold gap-2 py-2.5 px-3 focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    onClick={() => setPendingUpdate({ id: row.original.id, name: row.original.name, role: "customer" })}
                  >
                    <ShieldAlert size={14} /> Revoke Admin Access
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs font-semibold gap-2 py-2.5 px-3 opacity-50 cursor-not-allowed">
                  <Lock size={14} /> Deactivate Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <CMSPageHeader
        title="Team Management"
        subtitle="Manage administrative access and system roles for Pana Promotion staff."
        breadcrumbs={[{ label: "Team" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CMSDataTable 
            columns={columns} 
            data={users} 
            searchPlaceholder="Search by name or email..."
          />
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-border/40 shadow-sm bg-primary text-primary-foreground relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">
                <ShieldCheck size={14} /> Security Protocol
              </div>
              <p className="text-xl font-black tracking-tighter mb-4 leading-tight">
                Role Management Guidelines
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-[11px] font-bold opacity-80 leading-relaxed">
                  <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
                  Admin access grants full control over products, orders, and financial data.
                </li>
                <li className="flex gap-2 text-[11px] font-bold opacity-80 leading-relaxed">
                  <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
                  Only promote verified staff members from the Pana headquarters.
                </li>
              </ul>
            </div>
            <ShieldCheck size={100} className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </Card>

          <Card className="p-6 rounded-3xl border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
              <Calendar size={14} /> Access Audit
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/5 border border-border/20">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Admins</p>
                <p className="text-2xl font-black tracking-tighter">{users.filter(u => u.role === "admin").length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/5 border border-border/20">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Members</p>
                <p className="text-2xl font-black tracking-tighter">{users.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <CMSConfirmDialog
        isOpen={!!pendingUpdate}
        onClose={() => setPendingUpdate(null)}
        onConfirm={() => pendingUpdate && handleUpdateRole(pendingUpdate.id, pendingUpdate.role)}
        title={pendingUpdate?.role === "admin" ? "Promote to Administrator?" : "Revoke Administrative Access?"}
        description={`You are about to change the permissions for ${pendingUpdate?.name}. ${pendingUpdate?.role === "admin" 
          ? "This will grant them full access to all sensitive data and management tools." 
          : "They will lose access to the CMS and all administrative features."}`}
        confirmLabel={pendingUpdate?.role === "admin" ? "Confirm Promotion" : "Revoke Access"}
        variant={pendingUpdate?.role === "admin" ? "primary" : "destructive"}
      />
    </div>
  );
}

// Helper for conditional class mapping
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

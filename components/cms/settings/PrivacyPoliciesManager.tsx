"use client";

import React from "react";
import {
  useAllPrivacyPolicies,
  useDeletePrivacyPolicy,
} from "@/hooks/data/usePrivacyPolicies";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit, FileText } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { PrivacyPolicyForm } from "./PrivacyPolicyForm";
import { Skeleton } from "@/components/ui/skeleton";

interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  policy_type: "privacy" | "terms" | "cookie";
  version: number;
  is_active: boolean;
  effective_date?: string;
}

const POLICY_TYPE_LABELS: Record<string, string> = {
  privacy: "Privacy",
  terms: "Terms",
  cookie: "Cookie",
};

const POLICY_TYPE_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  privacy: "default",
  terms: "secondary",
  cookie: "outline",
};

export function PrivacyPoliciesManager() {
  const { data: policies, isLoading } = useAllPrivacyPolicies();
  const deletePolicy = useDeletePrivacyPolicy();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingPolicy, setEditingPolicy] = React.useState<PrivacyPolicy | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!policies?.length) {
    return (
      <>
        <CMSEmptyState
          icon={FileText}
          title="No Privacy Policies"
          description="Add privacy, terms of service, or cookie policies for the site."
          actionLabel="Add Policy"
          onClick={() => {
            setEditingPolicy(null);
            setIsFormOpen(true);
          }}
        />
        <PrivacyPolicyForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPolicy(null);
          }}
          initialData={editingPolicy}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
          onClick={() => {
            setEditingPolicy(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={14} />
          Add Policy
        </Button>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Title
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Version
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Effective Date
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy: PrivacyPolicy) => (
                <TableRow
                  key={policy.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4 font-bold text-sm">
                    {policy.title}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={POLICY_TYPE_VARIANTS[policy.policy_type] || "outline"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {POLICY_TYPE_LABELS[policy.policy_type] || policy.policy_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    v{policy.version}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {policy.effective_date
                      ? new Date(policy.effective_date).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={policy.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {policy.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => {
                          setEditingPolicy(policy);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(policy.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PrivacyPolicyForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPolicy(null);
        }}
        initialData={editingPolicy}
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deletePolicy.mutate(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        title="Delete Policy?"
        description="This will permanently remove this policy document. This cannot be undone."
      />
    </div>
  );
}

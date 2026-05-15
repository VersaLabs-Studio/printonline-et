"use client";

import React from "react";
import {
  useAllTestimonials,
  useDeleteTestimonial,
} from "@/hooks/data/useTestimonials";
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
import { Plus, Trash2, Edit, Star, MessageSquare } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { TestimonialForm } from "./TestimonialForm";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar_url?: string;
  rating?: number;
  quote: string;
  project?: string;
  display_order: number;
  is_active: boolean;
}

export function TestimonialsManager() {
  const { data: testimonials, isLoading } = useAllTestimonials();
  const deleteTestimonial = useDeleteTestimonial();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    React.useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!testimonials?.length) {
    return (
      <>
        <CMSEmptyState
          icon={MessageSquare}
          title="No Testimonials"
          description="Add customer testimonials for the homepage section."
          actionLabel="Add Testimonial"
          onClick={() => {
            setEditingTestimonial(null);
            setIsFormOpen(true);
          }}
        />
        <TestimonialForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTestimonial(null);
          }}
          initialData={editingTestimonial}
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
            setEditingTestimonial(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={14} />
          Add Testimonial
        </Button>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Role
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Company
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Rating
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Quote
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Project
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
              {testimonials.map((testimonial: Testimonial) => (
                <TableRow
                  key={testimonial.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {testimonial.avatar_url ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border/40 bg-muted/30 shrink-0">
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "";
                              (e.target as HTMLImageElement).classList.add("hidden");
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-muted-foreground">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-bold text-sm">
                        {testimonial.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {testimonial.role || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {testimonial.company || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={cn(
                            "fill-transparent",
                            (testimonial.rating ?? 0) > i
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground max-w-[250px] truncate">
                    &ldquo;{testimonial.quote}&rdquo;
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {testimonial.project || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={testimonial.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {testimonial.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => {
                          setEditingTestimonial(testimonial);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(testimonial.id)}
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

      <TestimonialForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTestimonial(null);
        }}
        initialData={editingTestimonial}
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTestimonial.mutate(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        title="Delete Testimonial?"
        description="This will permanently remove this testimonial from the homepage. This cannot be undone."
      />
    </div>
  );
}

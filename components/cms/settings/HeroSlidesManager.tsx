"use client";

import React from "react";
import {
  useAllHeroSlides,
  useDeleteHeroSlide,
} from "@/hooks/data/useHeroSlides";
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
import { Plus, Trash2, Edit, Image } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { HeroSlideForm } from "./HeroSlideForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  display_order: number;
  is_active: boolean;
}

export function HeroSlidesManager() {
  const { data: slides, isLoading } = useAllHeroSlides();
  const deleteSlide = useDeleteHeroSlide();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingSlide, setEditingSlide] = React.useState<HeroSlide | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const activeCount = (slides ?? []).filter((s: HeroSlide) => s.is_active).length;
  const maxActive = 4;

  const handleAdd = () => {
    if (activeCount >= maxActive) {
      toast.warning(`Maximum ${maxActive} active slides allowed. Deactivate one first.`);
      return;
    }
    setEditingSlide(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!slides?.length) {
    return (
      <>
        <CMSEmptyState
          icon={Image}
          title="No Hero Slides"
          description="Add hero banner slides for the homepage carousel."
          actionLabel="Add Slide"
          onClick={handleAdd}
        />
        <HeroSlideForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSlide(null);
          }}
          initialData={editingSlide}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {activeCount} / {maxActive} slides active
        </span>
        <Button
          className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
          onClick={handleAdd}
        >
          <Plus size={14} />
          Add Slide
        </Button>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Order
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Title
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Subtitle
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Image
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
              {slides.map((slide: HeroSlide) => (
                <TableRow
                  key={slide.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {slide.display_order}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-sm">
                    {slide.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground max-w-[200px] truncate">
                    {slide.subtitle || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {slide.image_url ? (
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-border/40 bg-muted/30">
                        <img
                          src={slide.image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                            (e.target as HTMLImageElement).classList.add("hidden");
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={slide.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {slide.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => {
                          setEditingSlide(slide);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(slide.id)}
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

      <HeroSlideForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSlide(null);
        }}
        initialData={editingSlide}
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteSlide.mutate(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        title="Delete Hero Slide?"
        description="This will permanently remove this hero slide from the homepage carousel. This cannot be undone."
      />
    </div>
  );
}

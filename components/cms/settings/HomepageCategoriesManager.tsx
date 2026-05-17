"use client";

import React from "react";
import {
  useHomepageCategories,
  useUpdateHomepageCategory,
} from "@/hooks/data/useHomepageCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { GripVertical, FolderOpen } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HomepageCategory } from "@/hooks/data/useHomepageCategories";

function SortableRow({
  category,
  onToggleHomepage,
}: {
  category: HomepageCategory;
  onToggleHomepage: (id: string, value: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`border-b border-border/20 hover:bg-muted/10 ${isDragging ? "bg-muted/20" : ""}`}
    >
      <TableCell className="px-4 py-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        >
          <GripVertical size={16} />
        </button>
      </TableCell>
      <TableCell className="px-6 py-4 text-xs text-muted-foreground font-mono">
        {category.homepage_display_order ?? 0}
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          {category.image_url ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/40 bg-muted/30 flex-shrink-0">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center flex-shrink-0">
              <FolderOpen size={16} className="text-muted-foreground" />
            </div>
          )}
          <div>
            <span className="font-bold text-sm">{category.name}</span>
            <p className="text-[10px] text-muted-foreground font-medium">
              /{category.slug}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 text-xs text-muted-foreground">
        {category.productCount} {category.productCount === 1 ? "item" : "items"}
      </TableCell>
      <TableCell className="px-6 py-4">
        <Badge
          variant={category.is_active ? "default" : "secondary"}
          className="text-[9px] uppercase tracking-widest"
        >
          {category.is_active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="px-6 py-4">
        <Switch
          checked={category.show_on_homepage ?? true}
          onCheckedChange={(checked) => onToggleHomepage(category.id, checked)}
        />
      </TableCell>
    </TableRow>
  );
}

export function HomepageCategoriesManager() {
  const { data: categories, isLoading } = useHomepageCategories();
  const updateCategory = useUpdateHomepageCategory();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [localCategories, setLocalCategories] = React.useState<HomepageCategory[]>([]);

  React.useEffect(() => {
    if (categories) {
      setLocalCategories(categories);
    }
  }, [categories]);

  const handleToggleHomepage = (id: string, value: boolean) => {
    updateCategory.mutate({ id, show_on_homepage: value });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalCategories((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);

      // Persist new order
      reordered.forEach((item, index) => {
        if (item.homepage_display_order !== index) {
          updateCategory.mutate({
            id: item.id,
            homepage_display_order: index,
          });
        }
      });

      return reordered;
    });
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!categories?.length) {
    return (
      <CMSEmptyState
        icon={FolderOpen}
        title="No Categories"
        description="Create categories in Products → Categories first."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {(localCategories ?? []).filter((c) => c.show_on_homepage).length} /{" "}
          {(localCategories ?? []).length} shown on homepage
        </span>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="bg-muted/30 border-b border-border/40">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-12 w-10 px-4" />
                  <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Order
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Products
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Show on Homepage
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={localCategories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {localCategories.map((category) => (
                    <SortableRow
                      key={category.id}
                      category={category}
                      onToggleHomepage={handleToggleHomepage}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}

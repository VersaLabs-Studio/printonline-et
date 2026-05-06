"use client";

import React from "react";
import {
  useDeliveryZones,
  useDeleteDeliveryZone,
} from "@/hooks/data/useDeliveryZones";
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
import { Plus, Trash2, Edit, MapPin } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { DeliveryZoneForm } from "./DeliveryZoneForm";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeliveryZoneWithTiers } from "@/hooks/data/useDeliveryZones";

export function DeliveryZoneManager() {
  const { data: zones, isLoading } = useDeliveryZones();
  const deleteZone = useDeleteDeliveryZone();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingZone, setEditingZone] =
    React.useState<DeliveryZoneWithTiers | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!zones?.length) {
    return (
      <>
        <CMSEmptyState
          icon={MapPin}
          title="No Delivery Zones"
          description="Add delivery zones for Addis Ababa sub-cities with their base fees."
          actionLabel="Add Zone"
          onClick={() => {
            setEditingZone(null);
            setIsFormOpen(true);
          }}
        />
        <DeliveryZoneForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingZone(null);
          }}
          initialData={editingZone}
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
            setEditingZone(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={14} />
          Add Zone
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
                  Sub-City
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Zone
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Description
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Base Fee
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
              {zones.map((zone) => (
                <TableRow
                  key={zone.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {zone.display_order}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-sm">
                    {zone.sub_city}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {zone.zone_label && (
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-widest"
                      >
                        {zone.zone_label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {zone.description || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold text-right">
                    ETB {zone.base_fee.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={zone.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {zone.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => {
                          setEditingZone(zone);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(zone.id)}
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

      <DeliveryZoneForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingZone(null);
        }}
        initialData={editingZone}
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteZone.mutate(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        title="Delete Delivery Zone?"
        description="This will permanently remove this delivery zone and all its quantity tiers. This cannot be undone."
      />
    </div>
  );
}

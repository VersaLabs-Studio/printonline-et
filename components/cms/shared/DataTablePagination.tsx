"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalEntries: number;
}

export function DataTablePagination<TData>({
  table,
  totalEntries,
}: DataTablePaginationProps<TData>) {
  const currentStart =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const currentEnd = Math.min(
    (table.getState().pagination.pageIndex + 1) *
      table.getState().pagination.pageSize,
    totalEntries,
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Showing <span className="text-foreground">{currentStart}</span> to{" "}
        <span className="text-foreground">{currentEnd}</span> of{" "}
        <span className="text-foreground">{totalEntries}</span> records
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-border/50 hover:bg-muted transition-all disabled:opacity-30"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-border/50 hover:bg-muted transition-all disabled:opacity-30"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={14} />
        </Button>
        <div className="flex items-center px-4 h-8 rounded-lg border border-border/50 bg-muted/20 text-[10px] font-medium uppercase tracking-tighter">
          Page {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-border/50 hover:bg-muted transition-all disabled:opacity-30"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-border/50 hover:bg-muted transition-all disabled:opacity-30"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight size={14} />
        </Button>
      </div>
    </div>
  );
}

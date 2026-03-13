"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./DataTablePagination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileDown, Search } from "lucide-react";

interface CMSDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  className?: string;
  hideSearch?: boolean;
  hidePagination?: boolean;
}

export function CMSDataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Filter records...",
  className,
  hideSearch = false,
  hidePagination = false,
}: CMSDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const exportToCSV = () => {
    if (!data.length) return;

    const headers = columns
      .filter((col) => col.header && typeof col.header === "string")
      .map((col) => col.header as string);

    const rows = table.getRowModel().rows.map((row) => {
      return columns
        .filter((col) => col.header && typeof col.header === "string")
        .map((col) => {
          const cellValue = row.getValue(col.id || (col as any).accessorKey);
          // Handle complex types or fallback to string
          if (typeof cellValue === "object") return "";
          return `"${String(cellValue).replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `export-${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {!hideSearch && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 h-10 rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary shadow-sm transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="rounded-xl h-10 px-4 font-semibold uppercase tracking-wider text-[10px] gap-2 border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <FileDown size={14} />
            Export CSV
          </Button>
        </div>
      )}

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card/30 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30 border-b border-border/40">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent border-none"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-border/20 last:border-0 hover:bg-primary/5 transition-colors group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                        <Search size={40} className="mb-2" />
                        <p className="text-sm font-medium uppercase tracking-wider">
                          No matching records
                        </p>
                        <p className="text-xs font-normal">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {!hidePagination && (
        <DataTablePagination table={table} totalEntries={data.length} />
      )}
    </div>
  );
}

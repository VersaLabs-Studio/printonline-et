"use client";

import React from "react";
import { useBulkImportPricing } from "@/hooks/data/usePricingMatrix";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingMatrixBulkImportProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedEntry {
  matrix_key: string;
  matrix_label: string;
  price: number;
}

export function PricingMatrixBulkImport({
  productId,
  isOpen,
  onClose,
}: PricingMatrixBulkImportProps) {
  const bulkImport = useBulkImportPricing();
  const [rawText, setRawText] = React.useState("");
  const [parsed, setParsed] = React.useState<ParsedEntry[]>([]);
  const [parseError, setParseError] = React.useState<string | null>(null);

  const parseInput = (text: string) => {
    setRawText(text);
    setParseError(null);

    if (!text.trim()) {
      setParsed([]);
      return;
    }

    try {
      const lines = text
        .trim()
        .split("\n")
        .filter((l) => l.trim());
      const entries: ParsedEntry[] = [];

      for (const line of lines) {
        const parts = line.includes("\t")
          ? line.split("\t")
          : line.split(",");

        if (parts.length < 2) {
          setParseError(`Invalid line: "${line}". Expected at least key and price.`);
          setParsed([]);
          return;
        }

        const key = parts[0].trim();
        const price = parseFloat(parts[parts.length - 1].trim());

        if (!key || isNaN(price)) {
          setParseError(`Invalid line: "${line}". Key must be non-empty and price must be a number.`);
          setParsed([]);
          return;
        }

        const label =
          parts.length > 2
            ? parts.slice(1, -1).join(",").trim()
            : "";

        entries.push({
          matrix_key: key,
          matrix_label: label,
          price,
        });
      }

      setParsed(entries);
    } catch {
      setParseError("Failed to parse input. Check the format.");
      setParsed([]);
    }
  };

  const handleImport = () => {
    if (!parsed.length) return;

    bulkImport.mutate(
      {
        productId,
        entries: parsed.map((e) => ({
          matrix_key: e.matrix_key,
          matrix_label: e.matrix_label || null,
          price: e.price,
          is_active: true,
        })),
      },
      {
        onSuccess: () => {
          setRawText("");
          setParsed([]);
          onClose();
        },
      }
    );
  };

  React.useEffect(() => {
    if (!isOpen) {
      setRawText("");
      setParsed([]);
      setParseError(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-primary" />
            Bulk Import Pricing Matrix
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Paste CSV or tab-separated data. Format:{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              key, label, price
            </code>{" "}
            or{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              key, price
            </code>{" "}
            per line.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder={`lamination:none|print_sides:front_only, No Lamination / Front Only, 350\nlamination:none|print_sides:both, No Lamination / Both Sides, 500\nlamination:glossy|print_sides:front_only, Glossy Lamination / Front Only, 450`}
            className="rounded-xl min-h-[200px] font-mono text-xs resize-none"
            value={rawText}
            onChange={(e) => parseInput(e.target.value)}
          />

          {parseError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
              <AlertCircle
                size={16}
                className="text-destructive mt-0.5 shrink-0"
              />
              <p className="text-xs text-destructive font-medium">
                {parseError}
              </p>
            </div>
          )}

          {parsed.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase tracking-widest"
                >
                  {parsed.length} entries parsed
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Preview (first 5):
                </span>
              </div>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-2 text-left font-bold uppercase tracking-wider text-[9px] text-muted-foreground">
                        Key
                      </th>
                      <th className="px-4 py-2 text-left font-bold uppercase tracking-wider text-[9px] text-muted-foreground">
                        Label
                      </th>
                      <th className="px-4 py-2 text-right font-bold uppercase tracking-wider text-[9px] text-muted-foreground">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.slice(0, 5).map((entry, i) => (
                      <tr key={i} className="border-t border-border/20">
                        <td className="px-4 py-2 font-mono">
                          {entry.matrix_key}
                        </td>
                        <td className="px-4 py-2">
                          {entry.matrix_label || "—"}
                        </td>
                        <td className="px-4 py-2 text-right font-bold">
                          ETB {entry.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.length > 5 && (
                  <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/10 border-t border-border/20">
                    ...and {parsed.length - 5} more entries
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className="rounded-xl h-10 font-bold uppercase tracking-widest text-[10px] px-6"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl h-10 font-bold uppercase tracking-widest text-[10px] px-6 gap-2"
              onClick={handleImport}
              disabled={!parsed.length || bulkImport.isPending}
            >
              <Upload size={14} />
              Import {parsed.length} Entries
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

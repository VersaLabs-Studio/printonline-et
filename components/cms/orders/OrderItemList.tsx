"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Download, ExternalLink, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { OrderWithItems } from "@/types";

interface OrderItemListProps {
  order: OrderWithItems;
}

export function OrderItemList({ order }: OrderItemListProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4">
        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <ShoppingCart size={16} className="text-primary" /> Order Items (
          {order.order_items?.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="p-6 flex gap-4 items-start hover:bg-muted/5 transition-colors"
            >
              <div className="h-16 w-16 rounded-xl bg-muted border border-border/40 overflow-hidden flex-shrink-0 shadow-inner">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <ShoppingCart size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-sm tracking-tight">
                    {item.product_name}
                  </h4>
                  <PriceDisplay
                    amount={item.line_total}
                    className="text-sm font-bold text-primary"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {item.quantity} x <PriceDisplay amount={item.unit_price} />
                </p>
                {item.selected_options && (
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(
                        item.selected_options as Record<string, string>,
                      )
                        .filter(
                          ([key]) =>
                            !["Asset URLs", "Uploaded Assets"].includes(key),
                        )
                        .map(([key, val]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="text-[9px] font-bold uppercase px-2 py-0.5 bg-muted/60 border-border/20 shadow-sm"
                          >
                            {key}: {val}
                          </Badge>
                        ))}
                    </div>

                    {/* Design Assets Display */}
                    {item.design_preference === "hire_designer" ||
                    (item.selected_options as Record<string, any>)?.Service ===
                      "Pana Designer" ? (
                      <div className="pt-2 border-t border-border/10">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary border-primary/20 gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                        >
                          <ShoppingCart size={12} /> Hire a Pana Designer
                        </Badge>
                      </div>
                    ) : (item.design_file_url ||
                        (item.order_item_design_assets &&
                          item.order_item_design_assets.length > 0) ||
                        (item.selected_options as Record<string, any>)?.[
                          "Asset URLs"
                        ]) && (
                      <div className="pt-2 space-y-2 border-t border-border/10">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 flex items-center gap-2">
                          <File size={12} /> Design Assets
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {/* New Structured Assets */}
                          {item.order_item_design_assets &&
                          item.order_item_design_assets.length > 0 ? (
                            item.order_item_design_assets.map(
                              (asset, idx) => (
                                <a
                                  key={asset.id || idx}
                                  href={asset.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
                                >
                                  <Download
                                    size={10}
                                    className="text-primary"
                                  />
                                  <span className="text-[9px] font-bold text-foreground truncate max-w-[150px] uppercase">
                                    {asset.file_name}
                                  </span>
                                  <ExternalLink
                                    size={8}
                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                </a>
                              ),
                            )
                          ) : (
                            <>
                              {/* Legacy Single File */}
                              {item.design_file_url && (
                                <a
                                  href={item.design_file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
                                >
                                  <Download
                                    size={10}
                                    className="text-primary"
                                  />
                                  <span className="text-[9px] font-bold text-foreground truncate max-w-[150px] uppercase">
                                    {item.design_file_name || "Main Design"}
                                  </span>
                                  <ExternalLink
                                    size={8}
                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                </a>
                              )}

                              {/* Legacy Metadata Array */}
                              {Array.isArray(
                                (item.selected_options as Record<string, any>)
                                  ?.["Asset URLs"],
                              ) &&
                                (item.selected_options as Record<string, any>)[
                                  "Asset URLs"
                                ]
                                  .filter(
                                    (url: string) =>
                                      url !== item.design_file_url,
                                  )
                                  .map((url: string, idx: number) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/10 hover:bg-muted/50 transition-colors group"
                                    >
                                      <Download
                                        size={10}
                                        className="text-muted-foreground"
                                      />
                                      <span className="text-[9px] font-bold text-foreground truncate max-w-[150px] uppercase">
                                        Asset {idx + 2}
                                      </span>
                                      <ExternalLink
                                        size={8}
                                        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                      />
                                    </a>
                                  ))}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-muted/10 p-6 space-y-3 border-t border-border/40">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">
              Subtotal
            </span>
            <PriceDisplay amount={order.subtotal} className="font-bold" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">
              Taxes & Fees
            </span>
            <PriceDisplay
              amount={order.tax_amount || 0}
              className="font-bold"
            />
          </div>
          <div className="flex justify-between text-lg pt-3 border-t-2 border-dashed border-border/40">
            <span className="font-bold uppercase tracking-widest text-xs">
              Total Amount
            </span>
            <PriceDisplay
              amount={order.total_amount}
              className="font-bold text-primary text-xl"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

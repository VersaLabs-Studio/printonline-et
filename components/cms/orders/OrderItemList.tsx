import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Download, ExternalLink, File, Info, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import type { OrderWithItems } from "@/types/database";
import Image from "next/image";

interface OrderItemListProps {
  order: OrderWithItems;
}

export function OrderItemList({ order }: OrderItemListProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-5 px-8">
        <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-between text-foreground/70">
          <div className="flex items-center gap-3">
            <ShoppingCart size={18} className="text-primary" /> 
            Manifest Items
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 font-mono text-[10px]">
            {order.order_items?.length || 0} SKU(s)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/20">
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="p-8 flex flex-col md:flex-row gap-8 items-start hover:bg-primary/5 transition-colors group"
            >
              <div className="relative h-32 w-32 md:h-24 md:w-24 rounded-2xl bg-muted border border-border/40 overflow-hidden flex-shrink-0 shadow-sm group-hover:border-primary/30 transition-all">
                {item.product_image ? (
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                    <ShoppingCart size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.product_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter bg-muted/50 border-border/20">
                        {item.category || "General"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Tag size={10} /> SKU-{(item.product_id || "PROD").substring(0, 5).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <PriceDisplay
                      amount={item.line_total}
                      className="text-xl font-bold text-primary tracking-tighter"
                    />
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                      Line Total (Inc. Tax)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Info size={12} className="text-primary/60" /> Specification Breakdown
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries((item.selected_options as Record<string, string | number | boolean>) || {})
                        .filter(([key, val]) => val && !['Service', 'Asset URLs'].includes(key))
                        .map(([key, val]) => (
                          <div 
                            key={key} 
                            className="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border/40 px-2.5 py-1.5 shadow-sm"
                          >
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter border-r border-border/40 pr-1.5">{key}</span>
                            <span className="text-xs font-semibold text-foreground/80">{String(val)}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <File size={12} className="text-primary/60" /> Production Assets
                    </p>
                    
                    <div className="space-y-2">
                      {item.design_preference === "hire_designer" ||
                      (item.selected_options as Record<string, string>)?.Service === "Pana Designer" ? (
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                            <ShoppingCart size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Design Required</p>
                            <p className="text-[11px] font-medium text-foreground/70 mt-1">Hire a Pana Designer selected</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {item.order_item_design_assets && item.order_item_design_assets.length > 0 ? (
                            item.order_item_design_assets.map((asset) => (
                              <a
                                key={asset.id}
                                href={asset.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all w-full sm:w-auto"
                              >
                                <div className="h-6 w-6 rounded-md bg-background border border-border/20 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-colors">
                                  <Download size={12} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold text-foreground/80 group-hover/btn:text-primary transition-colors uppercase tracking-tight truncate max-w-[120px]">
                                    {asset.file_name}
                                  </p>
                                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                    {(asset.file_size ? (asset.file_size / (1024 * 1024)).toFixed(2) : "0.00")} MB
                                  </p>
                                </div>
                                <ExternalLink size={10} className="text-muted-foreground/40 ml-auto" />
                              </a>
                            ))
                          ) : item.design_file_url ? (
                            <a
                              href={item.design_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all w-full"
                            >
                              <div className="h-8 w-8 rounded-lg bg-background border border-border/20 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-colors">
                                <File size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold text-foreground/80 group-hover/btn:text-primary transition-colors uppercase tracking-tight truncate">
                                  {item.design_file_name || "Primary Design Asset"}
                                </p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 italic">
                                  Legacy Upload Interface
                                </p>
                              </div>
                              <ExternalLink size={12} className="text-muted-foreground/40 ml-auto" />
                            </a>
                          ) : (
                            <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/10 w-full flex items-center justify-center">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">No Assets Attached</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/10 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Unit Weighting</span>
                    <span className="text-xs font-semibold text-foreground/70">
                      {item.quantity} Unit(s) @ <PriceDisplay amount={item.unit_price} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/10 p-10 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-border/40">
          <div className="space-y-4">
            <h6 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Operational Intelligence</h6>
            <div className="p-4 rounded-2xl bg-background/50 border border-border/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Base Value</span>
                <PriceDisplay amount={order.subtotal} className="text-sm font-semibold" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Taxation (15% VAT)</span>
                <PriceDisplay amount={order.tax_amount || 0} className="text-sm font-semibold text-emerald-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Logistics Surcharge</span>
                <PriceDisplay amount={order.delivery_fee || 0} className="text-sm font-semibold" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-end items-end space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground translate-x-1">Total Receivables</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-primary/40 uppercase tracking-tighter">ETB</span>
              <PriceDisplay
                amount={order.total_amount}
                className="text-5xl font-black text-primary tracking-tighter"
              />
            </div>
            <div className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Finance Verified • Tax Inclusive</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

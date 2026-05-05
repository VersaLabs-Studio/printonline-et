"use client";

import React from "react";
import Image from "next/image";
import { User, MapPin, Mail, Phone, Info, File, ExternalLink, Download, Receipt, CreditCard, Calendar, Hash } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderWithItems, OrderItemDesignAsset } from "@/types/database";

interface ConfirmationDetailsProps {
  orderDetails: OrderWithItems;
}

interface PaymentReceipt {
  tx_ref?: string;
  amount?: number;
  currency?: string;
  method?: string;
  status?: string;
  created_at?: string;
}

export function ConfirmationDetails({
  orderDetails,
}: ConfirmationDetailsProps) {
  const items = orderDetails.order_items || [];
  const receipt = (orderDetails.payment_receipt as PaymentReceipt | null) || {};

  const handlePrintReceipt = () => {
    const receiptHtml = `<!DOCTYPE html>
<html><head><title>Receipt - ${orderDetails.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a1a; }
  .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #e5e5e5; padding-bottom: 24px; }
  .header h1 { font-size: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
  .header p { font-size: 12px; color: #666; margin-top: 4px; }
  .section { margin-bottom: 24px; }
  .section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .row .label { color: #666; }
  .row .value { font-weight: 600; }
  .items { margin-bottom: 24px; }
  .item { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .item-name { font-weight: 600; font-size: 13px; }
  .item-qty { font-size: 11px; color: #888; }
  .total-row { font-size: 16px; font-weight: 700; border-top: 2px solid #1a1a1a; padding-top: 12px; margin-top: 12px; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 16px; }
</style></head><body>
<div class="header">
  <h1>PrintOnline Ethiopia</h1>
  <p>Payment Receipt</p>
  <p>Order: ${orderDetails.order_number}</p>
  ${orderDetails.created_at ? `<p>Date: ${new Date(orderDetails.created_at).toLocaleDateString()}</p>` : ''}
</div>
<div class="section">
  <h3>Customer</h3>
  <div class="row"><span class="label">Name</span><span class="value">${orderDetails.customer_name}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${orderDetails.customer_email}</span></div>
  <div class="row"><span class="label">Phone</span><span class="value">${orderDetails.customer_phone || 'N/A'}</span></div>
</div>
<div class="section">
  <h3>Delivery</h3>
  <div class="row"><span class="label">Address</span><span class="value">${orderDetails.delivery_address}</span></div>
  <div class="row"><span class="label">City</span><span class="value">${orderDetails.delivery_city}, ${orderDetails.delivery_sub_city}</span></div>
</div>
<div class="items">
  <h3>Items</h3>
  ${items.map((item: { product_name?: string; quantity?: number; line_total?: number }) => `
    <div class="item">
      <div style="display:flex;justify-content:space-between">
        <span class="item-name">${item.product_name || 'Product'}</span>
        <span class="item-qty">ETB ${(item.line_total || 0).toLocaleString()}</span>
      </div>
      <span class="item-qty">Qty: ${item.quantity || 1}</span>
    </div>
  `).join('')}
</div>
<div class="section">
  <h3>Payment</h3>
  <div class="row"><span class="label">Subtotal</span><span class="value">ETB ${(orderDetails.subtotal || 0).toLocaleString()}</span></div>
  <div class="row"><span class="label">Delivery</span><span class="value">ETB ${(orderDetails.delivery_fee || 0).toLocaleString()}</span></div>
  <div class="row total-row"><span class="label">Total</span><span class="value">ETB ${(orderDetails.total_amount || 0).toLocaleString()}</span></div>
  ${receipt.tx_ref ? `<div class="row"><span class="label">Reference</span><span class="value">${receipt.tx_ref}</span></div>` : ''}
  ${receipt.method ? `<div class="row"><span class="label">Method</span><span class="value">${receipt.method}</span></div>` : ''}
  ${receipt.status ? `<div class="row"><span class="label">Status</span><span class="value">${receipt.status}</span></div>` : ''}
</div>
<div class="footer">
  <p>Thank you for your order!</p>
  <p>PrintOnline Ethiopia — Pana Promotion PLC</p>
</div>
</body></html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
      {/* Order Details */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            Order Items
          </h3>
          <div className="space-y-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {items.map((item: any, i: number) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-8 pb-8 border-b border-border/10 last:border-0 last:pb-0"
              >
                <div className="relative h-40 w-full md:w-32 rounded-2xl overflow-hidden bg-muted/20 border border-border/20 shadow-inner shrink-0">
                  <Image
                    src={item.product_image || "/placeholder.jpg"}
                    alt={item.product_name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold tracking-tight text-foreground uppercase">
                        {item.product_name}
                      </h4>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider opacity-60">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <PriceDisplay
                      amount={item.line_total || 0}
                      className="font-semibold text-base"
                    />
                  </div>

                  {item.selected_options &&
                    Object.keys(item.selected_options).length > 0 && (
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-border/10">
                         {Object.entries((item.selected_options as Record<string, string | number | boolean>) || {})
                          .filter(([key, val]) => val && !['Service', 'Asset URLs'].includes(key))
                          .map(([key, val]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="text-[9px] font-medium bg-muted/50 border-border/20 px-2 py-0.5 rounded-md"
                          >
                            {key}: {String(val)}
                          </Badge>
                        ))}
                      </div>
                    )}

                  {/* UX Distinction: Design Package vs Upload */}
                  {item.design_preference === "hire_designer" ||
                  item.selected_options?.["Design Package"] ||
                  item.selected_options?.Service === "Pana Designer" ? (
                    <div className="pt-4 border-t border-border/10">
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-primary/10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                          <User size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60">
                            Design Package
                          </p>
                          <p className="text-sm font-bold uppercase tracking-tight text-foreground">
                            {item.selected_options?.["Design Package"] || "Hire a Pana Designer"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (item.design_file_url ||
                      (item.order_item_design_assets &&
                        item.order_item_design_assets.length > 0) ||
                      item.selected_options?.["Asset URLs"]) && (
                    <div className="pt-4 border-t border-border/10 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 flex items-center gap-2">
                        <File size={12} /> Design Assets
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* New Nested Assets Structure */}
                         {item.order_item_design_assets &&
                         item.order_item_design_assets.length > 0 ? (
                           item.order_item_design_assets.map(
                             (asset: OrderItemDesignAsset, idx: number) => (
                              <a
                                key={asset.id || idx}
                                href={asset.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group scale-100 active:scale-95"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Download
                                    size={12}
                                    className="text-primary shrink-0"
                                  />
                                  <span className="text-[10px] font-bold text-foreground truncate uppercase">
                                    {asset.file_name}
                                  </span>
                                </div>
                                <ExternalLink
                                  size={10}
                                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                                />
                              </a>
                            ),
                          )
                        ) : (
                          <>
                            {/* Fallback to legacy column */}
                            {item.design_file_url && (
                              <a
                                href={item.design_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Download
                                    size={12}
                                    className="text-primary shrink-0"
                                  />
                                  <span className="text-[10px] font-bold text-foreground truncate uppercase">
                                    {item.design_file_name || "Main Design"}
                                  </span>
                                </div>
                                <ExternalLink
                                  size={10}
                                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                                />
                              </a>
                            )}
                            {/* Fallback to metadata array */}
                            {Array.isArray(
                              item.selected_options?.["Asset URLs"],
                            ) &&
                              item.selected_options["Asset URLs"]
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
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/10 hover:bg-muted/50 transition-all group"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Download
                                        size={12}
                                        className="text-muted-foreground shrink-0"
                                      />
                                      <span className="text-[10px] font-bold text-foreground truncate uppercase">
                                        Asset {idx + 2}
                                      </span>
                                    </div>
                                    <ExternalLink
                                      size={10}
                                      className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                                    />
                                  </a>
                                ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/5 border border-border/20 rounded-2xl p-8 space-y-4 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <User size={14} /> Account Holder
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-tight text-foreground">
                {orderDetails.customer_name}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Mail size={12} className="opacity-40" />{" "}
                {orderDetails.customer_email}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Phone size={12} className="opacity-40" />{" "}
                {orderDetails.customer_phone || "Not Provided"}
              </div>
              <p className="text-[10px] font-semibold text-primary uppercase opacity-60 mt-2 block">
                TIN: {orderDetails.customer_tin || "Not Provided"}
              </p>
            </div>
          </div>

          <div className="bg-muted/5 border border-border/20 rounded-2xl p-8 space-y-4 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <MapPin size={14} /> Logistics Information
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-tight text-foreground">
                {orderDetails.delivery_address}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase opacity-80">
                {orderDetails.delivery_city}, {orderDetails.delivery_sub_city}
              </p>
              <p className="text-xs font-semibold text-emerald-500 uppercase opacity-80 mt-1 block">
                Delivery / Collection Included
              </p>
            </div>
          </div>
        </div>

        {orderDetails.special_instructions && (
          <div className="bg-muted/5 border border-border/20 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 flex items-center gap-2 mb-2">
              Special Instructions Note
            </h4>
            <p className="text-sm font-semibold text-muted-foreground italic leading-relaxed">
              &quot;{orderDetails.special_instructions}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="lg:col-span-4">
        <div className="bg-card border border-border/40 p-8 rounded-2xl shadow-sm lg:sticky lg:top-24">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            Payment Summary
          </h3>
          <div className="space-y-6 pt-6 border-t border-border/20">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Total Processing
                </span>
                <p className="text-xs font-semibold text-muted-foreground uppercase italic leading-none">
                  VAT Inclusive (15%)
                </p>
              </div>
              <PriceDisplay
                amount={orderDetails.total_amount || 0}
                className="text-2xl font-semibold text-primary tracking-tight"
              />
            </div>
            {orderDetails.payment_status && (
              <div className="flex justify-between items-center py-4 border-t border-border/10">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Finance Status
                </p>
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  orderDetails.payment_status === "paid"
                    ? "text-emerald-500"
                    : "text-primary"
                }`}>
                  {orderDetails.payment_status === "paid"
                    ? "Payment Confirmed"
                    : orderDetails.payment_status === "pending_payment"
                      ? "Awaiting Payment"
                      : orderDetails.payment_status}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border/10 flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:rotate-12">
              <Info size={14} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase leading-relaxed opacity-60">
              Orders enter active production once accounting confirms successful
              deposit/transfer.
            </p>
          </div>

          {/* Payment Receipt Section */}
          {orderDetails.payment_receipt && (
            <div className="mt-8 pt-6 border-t border-border/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Receipt size={14} /> Payment Receipt
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintReceipt}
                  className="h-8 text-[10px] font-bold uppercase tracking-widest gap-1.5"
                >
                  <Download size={12} /> Print
                </Button>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/10">
                {/* Transaction Reference */}
                {receipt.tx_ref && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Hash size={10} /> Reference
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {receipt.tx_ref}
                    </span>
                  </div>
                )}
                {/* Amount */}
                {receipt.amount && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <CreditCard size={10} /> Amount Paid
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {receipt.currency || "ETB"} {Number(receipt.amount).toLocaleString()}
                    </span>
                  </div>
                )}
                {/* Method */}
                {receipt.method && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                      Method
                    </span>
                    <span className="text-xs font-semibold text-foreground uppercase">
                      {receipt.method}
                    </span>
                  </div>
                )}
                {/* Status */}
                {receipt.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                      Status
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border-emerald-200"
                    >
                      {receipt.status}
                    </Badge>
                  </div>
                )}
                {/* Date */}
                {receipt.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Calendar size={10} /> Date
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {new Date(receipt.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

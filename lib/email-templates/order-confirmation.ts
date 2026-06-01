// lib/email-templates/order-confirmation.ts

import { emailLayout } from "./layout";

interface OrderConfirmationItem {
  product_name: string;
  quantity: number;
  line_total: number;
  selected_options?: Record<string, string>;
  design_preference?: string;
}

interface OrderConfirmationData {
  order_number: string;
  status: string;
  items: OrderConfirmationItem[];
  subtotal: number;
  delivery_fee?: number;
  total_amount: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const emailTemplateOrderConfirmation = (
  orderData: OrderConfirmationData,
  customerName: string,
): string => {
  const statusLabel = formatStatus(orderData.status);

  const itemsHtml = orderData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${item.product_name}</p>
        ${
          item.selected_options && Object.keys(item.selected_options).length > 0
            ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">${Object.entries(item.selected_options)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" &middot; ")}</p>`
            : ""
        }
        ${
          item.design_preference === "hire_designer"
            ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #92400e; font-weight: 600;">+ ${item.selected_options?.["Design Package"] || "Hire Designer Service"}</p>`
            : ""
        }
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #4b5563;">${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">ETB ${formatCurrency(item.line_total)}</td>
    </tr>`,
    )
    .join("");

  return emailLayout({
    title: `Order Confirmation - ${orderData.order_number}`,
    children: `
      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
        Order Confirmed!
      </h2>
      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
        Dear ${customerName}, thank you for your order! We've received your order and it's being processed.
      </p>

      <!-- Order Info Bar -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <tr>
          <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Number</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">${orderData.order_number}</p>
                </td>
                <td align="right">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Status</p>
                  <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 9999px;">${statusLabel}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Items Table -->
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #374151;">
        Order Items
      </h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Item</th>
            <th style="text-align: center; padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Qty</th>
            <th style="text-align: right; padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
        <tr>
          <td style="padding: 8px 0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 14px; color: #4b5563;">Subtotal</td>
                <td align="right" style="font-size: 14px; color: #111827; font-weight: 600;">ETB ${formatCurrency(orderData.subtotal)}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${
          orderData.delivery_fee && orderData.delivery_fee > 0
            ? `<tr>
                <td style="padding: 8px 0;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size: 14px; color: #4b5563;">Delivery</td>
                      <td align="right" style="font-size: 14px; color: #111827; font-weight: 600;">ETB ${formatCurrency(orderData.delivery_fee)}</td>
                    </tr>
                  </table>
                </td>
              </tr>`
            : ""
        }
        <tr>
          <td style="padding: 12px 0 0 0; border-top: 2px solid #111827;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 16px; font-weight: 700; color: #111827;">Total</td>
                <td align="right" style="font-size: 20px; font-weight: 700; color: #fbbf24;">ETB ${formatCurrency(orderData.total_amount)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;" align="center">
        <tr>
          <td align="center" style="border-radius: 12px; background-color: #000000;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://printonline.et"}/orders/${orderData.order_number}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">View Your Order</a>
          </td>
        </tr>
      </table>

      <!-- Help Text -->
      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
        We'll notify you when the status of your order changes. If you have any questions, please contact us at
        <a href="mailto:order@printonline.et" style="color: #fbbf24; text-decoration: none; font-weight: 600;">order@printonline.et</a>.
      </p>
    `,
  });
};

// lib/email-templates/payment-failed.ts

import { emailLayout } from "./layout";

interface PaymentFailedItem {
  product_name: string;
  quantity: number;
  line_total: number;
}

interface PaymentFailedOrderData {
  order_number: string;
  total_amount: number;
  items: PaymentFailedItem[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const emailTemplatePaymentFailed = (
  orderData: PaymentFailedOrderData,
  customerName: string,
  retryLink: string,
): string => {
  const itemsHtml = orderData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827;">${item.product_name}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #4b5563;">${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">ETB ${formatCurrency(item.line_total)}</td>
    </tr>`,
    )
    .join("");

  return emailLayout({
    title: `Payment Issue - ${orderData.order_number}`,
    children: `
      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #dc2626;">
        Payment Issue
      </h2>
      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
        Dear ${customerName}, we encountered an issue processing the payment for your order. Don't worry &mdash; your order is saved and you can retry the payment at any time.
      </p>

      <!-- Order Info Bar -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <tr>
          <td style="background-color: #fef2f2; border-radius: 12px; padding: 16px 20px; border: 1px solid #fecaca;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Number</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">${orderData.order_number}</p>
                </td>
                <td align="right">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Amount</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #dc2626;">ETB ${formatCurrency(orderData.total_amount)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Items Table -->
      <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #374151;">
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

      <!-- What Happened -->
      <div style="background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #92400e;">What happened?</p>
        <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">
          The payment could not be completed. This could be due to insufficient funds, a network timeout, payment cancellation, or a declined card.
        </p>
      </div>

      <!-- CTA Button -->
      <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;" align="center">
        <tr>
          <td align="center" style="border-radius: 12px; background-color: #000000;">
            <a href="${retryLink}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Retry Payment</a>
          </td>
        </tr>
      </table>

      <!-- Fallback URL -->
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-align: center;">
        Or copy this link:
      </p>
      <p style="margin: 0 0 24px 0; font-size: 12px; color: #fbbf24; word-break: break-all; text-align: center;">
        ${retryLink}
      </p>

      <!-- Support Info -->
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #111827;">Need help?</p>
        <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.8;">
          Email: <a href="mailto:order@printonline.et" style="color: #fbbf24; text-decoration: none; font-weight: 600;">order@printonline.et</a><br/>
          Phone: +251911005255<br/>
          Hours: Mon&ndash;Sat, 8:30 AM &ndash; 6:00 PM EAT
        </p>
      </div>
    `,
  });
};

// lib/email-templates/admin-new-order.ts

import { emailLayout } from "./layout";

interface AdminNewOrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface AdminNewOrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  currency: string;
  payment_method?: string;
  items: AdminNewOrderItem[];
  created_at: string;
}

function formatCurrency(amount: number, currency: string = "ETB"): string {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency,
  }).format(amount);
}

export function emailTemplateAdminNewOrder(order: AdminNewOrderData): string {
  const formattedTotal = formatCurrency(order.total_amount, order.currency || "ETB");

  const orderDate = new Date(order.created_at).toLocaleString("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const cmsOrderUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://printonline.et"}/cms/orders/${order.order_number}`;

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827;">${item.product_name}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #4b5563;">${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">${formatCurrency(item.total_price, order.currency || "ETB")}</td>
    </tr>`,
    )
    .join("");

  return emailLayout({
    title: `New Order - ${order.order_number}`,
    headerTagline: "Admin Notification",
    children: `
      <!-- Heading -->
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
        New Order Received
      </h2>

      <!-- Order Number Bar -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <tr>
          <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Number</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">${order.order_number}</p>
                </td>
                <td align="right">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Date</p>
                  <p style="margin: 0; font-size: 14px; color: #4b5563;">${orderDate}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Customer Details -->
      <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #fbbf24;">
        <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e;">Customer Details</h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #78350f; width: 100px; font-weight: 600;">Name</td>
            <td style="padding: 4px 0; font-size: 14px; color: #78350f;">${order.customer_name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #78350f; font-weight: 600;">Email</td>
            <td style="padding: 4px 0; font-size: 14px; color: #78350f;">${order.customer_email}</td>
          </tr>
          ${
            order.customer_phone
              ? `<tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #78350f; font-weight: 600;">Phone</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #78350f;">${order.customer_phone}</td>
                </tr>`
              : ""
          }
          ${
            order.payment_method
              ? `<tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #78350f; font-weight: 600;">Payment</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #78350f;">${order.payment_method}</td>
                </tr>`
              : ""
          }
        </table>
      </div>

      <!-- Items Table -->
      <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #374151;">
        Order Items
      </h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Item</th>
            <th style="text-align: center; padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Qty</th>
            <th style="text-align: right; padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Total -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
        <tr>
          <td style="background-color: #f9fafb; border-radius: 12px; padding: 16px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 16px; font-weight: 700; color: #111827;">Total Amount</td>
                <td align="right" style="font-size: 22px; font-weight: 700; color: #fbbf24;">${formattedTotal}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;" align="center">
        <tr>
          <td align="center" style="border-radius: 12px; background-color: #000000;">
            <a href="${cmsOrderUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">View Order in CMS</a>
          </td>
        </tr>
      </table>

      <!-- Notice -->
      <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
        This is an automated notification from PrintOnline.et
      </p>
    `,
  });
}

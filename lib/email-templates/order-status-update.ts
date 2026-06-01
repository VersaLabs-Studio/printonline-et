// lib/email-templates/order-status-update.ts

import { emailLayout } from "./layout";

function formatOrderStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const emailTemplateOrderStatusUpdate = (
  orderNumber: string,
  status: string,
  note?: string,
): string => {
  const formattedStatus = formatOrderStatus(status);

  return emailLayout({
    title: `Order Update - ${orderNumber}`,
    children: `
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
        Order Status Updated
      </h2>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <tr>
          <td style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Number</p>
                  <p style="margin: 0; font-size: 20px; font-weight: 700; color: #111827;">${orderNumber}</p>
                </td>
                <td align="right">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Status</p>
                  <span style="display: inline-block; background-color: #fbbf24; color: #000000; font-size: 14px; font-weight: 700; padding: 6px 16px; border-radius: 9999px;">${formattedStatus}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${
        note
          ? `<div style="background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #92400e;">Note</p>
              <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">${note}</p>
            </div>`
          : ""
      }

      <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;" align="center">
        <tr>
          <td align="center" style="border-radius: 12px; background-color: #000000;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://printonline.et"}/orders/${orderNumber}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">View Order Status</a>
          </td>
        </tr>
      </table>
    `,
  });
};

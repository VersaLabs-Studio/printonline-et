// lib/email-templates/email-verification.ts

import { emailLayout } from "./layout";

export function emailTemplateVerification(name: string, url: string): string {
  return emailLayout({
    title: "Verify Your Email",
    children: `
      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #111827;">
        Verify Your Email Address
      </h2>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
        Hi ${name}, welcome to PrintOnline.et! Please verify your email address to activate your account and start ordering.
      </p>
      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
        Verifying your email allows you to:
      </p>

      <!-- Benefits -->
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
        <ul style="margin: 0; padding: 0 0 0 20px; color: #4b5563; font-size: 14px; line-height: 2;">
          <li>Track your orders in real-time</li>
          <li>Receive order status notifications</li>
          <li>Access your full order history</li>
          <li>Enjoy a faster checkout experience</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;" align="center">
        <tr>
          <td align="center" style="border-radius: 12px; background-color: #fbbf24;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: 700; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Verify Email Address</a>
          </td>
        </tr>
      </table>

      <!-- Fallback URL -->
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>
      <p style="margin: 0 0 24px 0; font-size: 12px; color: #fbbf24; word-break: break-all;">
        ${url}
      </p>

      <!-- Ignore Notice -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
        <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
          If you did not create an account with PrintOnline.et, you can safely ignore this email. No action will be taken.
        </p>
      </div>
    `,
  });
}

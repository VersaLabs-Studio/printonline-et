// lib/email-templates/password-reset.ts

import { emailLayout } from "./layout";

export const emailTemplatePasswordReset = (
  name: string,
  url: string,
): string => {
  return emailLayout({
    title: "Reset Your Password",
    // Keep the reset email header clean — no marketing tagline for security-sensitive emails.
    headerTagline: "",
    children: `
      <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Reset your password</h2>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
        Hello ${name}, we received a request to reset the password for your account. If you didn't request this, you can safely ignore this email.
      </p>

      <div style="background-color: #fffbeb; border-left: 4px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>Note:</strong> This link will expire in 1 hour for security purposes.
        </p>
      </div>

      <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px auto;">
        <tr>
          <td align="center" style="border-radius: 12px; background-color: #000000;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Reset Password</a>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>
      <p style="margin: 0 0 24px 0; font-size: 12px; color: #fbbf24; word-break: break-all;">
        ${url}
      </p>
    `,
  });
};

// lib/email-templates/layout.ts

interface EmailLayoutProps {
  title: string;
  children: string;
  headerTagline?: string;
  showFooter?: boolean;
}

export function emailLayout({
  title,
  children,
  headerTagline = "Pana Promotion Presence",
  showFooter = true,
}: EmailLayoutProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - PrintOnline.et</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f9fafb; color: #111827;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0 20px 0; background-color: #000000;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.05em; text-transform: uppercase;">
                PrintOnline<span style="color: #fbbf24;">.et</span>
              </h1>
              ${headerTagline ? `<p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em;">${headerTagline}</p>` : ""}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${children}
            </td>
          </tr>

          ${showFooter
            ? `
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af;">&copy; 2026 Pana Promotion. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">Addis Ababa, Ethiopia</p>
            </td>
          </tr>
          `
            : ""}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

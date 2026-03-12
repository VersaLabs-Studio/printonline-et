// lib/email-templates/password-reset.ts
export const emailTemplatePasswordReset = (name: string, url: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - PrintOnline.et</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f9fafb; color: #111827;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <!-- Header/Logo -->
          <tr>
            <td align="center" style="padding: 40px 0 20px 0; background-color: #000000;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking-tighter: -0.05em; text-transform: uppercase;">
                PrintOnline<span style="color: #fbbf24;">.et</span>
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Reset your password</h2>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Hello ${name}, we received a request to reset the password for your account. If you didn't request this, you can safely ignore this email.
              </p>
              
              <div style="background-color: #fffbeb; border-left: 4px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>Note:</strong> This link will expire in 1 hour for security purposes.
                </p>
              </div>
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #000000;">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; font-size: 12px; color: #fbbf24; word-break: break-all;">
                ${url}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af;">&copy; 2026 Pana Promotion. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">Addis Ababa, Ethiopia</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

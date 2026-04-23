// lib/email-templates/account-deletion.ts
export const emailTemplateAccountDeletion = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion Confirmed - PrintOnline.et</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f9fafb; color: #111827;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <tr>
            <td align="center" style="padding: 40px 0 20px 0; background-color: #000000;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking-tighter: -0.05em; text-transform: uppercase;">
                PrintOnline<span style="color: #fbbf24;">.et</span>
              </h1>
              <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em;">Pana Promotion Presence</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Account Deletion Confirmed</h2>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Hello ${name},
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Your PrintOnline.et account has been successfully deactivated. We're sorry to see you go.
              </p>
              
              <div style="background-color: #fef3c7; border-radius: 16px; padding: 24px; margin-bottom: 30px; border: 1px solid #fbbf24;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #92400e;">What happens next:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #78350f; font-size: 14px; line-height: 1.6;">
                  <li>Your personal data has been deactivated immediately</li>
                  <li>Any pending orders will continue to be processed</li>
                  <li>Your order history is preserved for reference</li>
                  <li>You can create a new account at any time</li>
                </ul>
              </div>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280;">
                If you believe this was done in error or have any questions, please contact our support team at <a href="mailto:order@printonline.et" style="color: #fbbf24; text-decoration: none; font-weight: 600;">order@printonline.et</a>.
              </p>
              
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Thank you for being part of the PrintOnline.et community.
              </p>
            </td>
          </tr>
          
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

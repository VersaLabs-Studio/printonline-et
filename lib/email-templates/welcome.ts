// lib/email-templates/welcome.ts
export const emailTemplateWelcome = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PrintOnline.et</title>
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
              <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em;">Pana Promotion Presence</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Welcome to the family, ${name}!</h2>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                We're thrilled to have you join Ethiopia's premier online printing platform. Whether you're looking for professional business cards, custom promotional items, or high-quality signage, we're here to bring your vision to life.
              </p>
              
              <div style="background-color: #f3f4f6; border-radius: 16px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #374151;">Your Account Benefits:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                  <li>Track your orders in real-time</li>
                  <li>Access 8-step production status pipeline</li>
                  <li>Securely upload your design files</li>
                  <li>One-click reordering for future projects</li>
                </ul>
              </div>
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #fbbf24;">
                    <a href="https://printonline.et/catalog" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 14px; font-weight: 700; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Start Your First Project</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                If you have any questions, simply reply to this email or contact our support team at <a href="mailto:order@printonline.et" style="color: #fbbf24; text-decoration: none; font-weight: 600;">order@printonline.et</a>.
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

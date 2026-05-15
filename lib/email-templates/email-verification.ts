export function emailTemplateVerification(name: string, url: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="color: #1a1a2e; margin-bottom: 16px;">Welcome to PrintOnline.et!</h1>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">Please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${url}" style="display: inline-block; background: #fbbf24; color: #1a1a2e; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
    </div>
    <p style="color: #888; font-size: 14px;">If you did not create this account, please ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
    <p style="color: #aaa; font-size: 12px;">PrintOnline.et — Professional Printing Solutions, Addis Ababa, Ethiopia</p>
  </div>
</body>
</html>`;
}

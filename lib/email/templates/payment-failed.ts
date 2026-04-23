// lib/email/templates/payment-failed.ts
// Email template for payment failure notifications

interface PaymentFailedEmailParams {
  orderNumber: string;
  customerName: string;
  orderItems: Array<{
    product_name: string;
    quantity: number;
    line_total: number;
  }>;
  totalAmount: number;
  failureReason?: string;
  retryUrl: string;
}

export const paymentFailedEmailTemplate = ({
  orderNumber,
  customerName,
  orderItems,
  totalAmount,
  failureReason,
  retryUrl,
}: PaymentFailedEmailParams): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .order-summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .order-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .order-item:last-child { border-bottom: none; }
    .total { font-weight: bold; font-size: 18px; color: #f59e0b; margin-top: 10px; padding-top: 10px; border-top: 2px solid #f59e0b; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Payment Issue</h1>
  </div>
  
  <div class="content">
    <p>Dear ${customerName},</p>
    
    <p>We encountered an issue processing your payment for order <strong>#${orderNumber}</strong>.</p>
    
    ${failureReason ? `
    <div class="warning-box">
      <strong>Reason:</strong> ${failureReason}
    </div>
    ` : ''}
    
    <div class="order-summary">
      <h3 style="margin-top: 0;">Order Summary</h3>
      ${orderItems.map(item => `
        <div class="order-item">
          <span>${item.product_name} × ${item.quantity}</span>
          <span>ETB ${item.line_total.toLocaleString()}</span>
        </div>
      `).join('')}
      <div class="total">
        <span>Total: ETB ${totalAmount.toLocaleString()}</span>
      </div>
    </div>
    
    <p>Your order has been saved and is ready for payment retry. You can:</p>
    
    <ul>
      <li>Retry the payment using the button below</li>
      <li>Choose a different payment method</li>
      <li>Contact our support team for assistance</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="${retryUrl}" class="button">Retry Payment</a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      <strong>Need help?</strong><br>
      Email: support@printonline.et<br>
      Phone: +251 911 005 255
    </p>
  </div>
  
  <div class="footer">
    <p>PrintOnline Ethiopia | Addis Ababa, Ethiopia</p>
    <p>This is an automated message. Please do not reply.</p>
  </div>
</body>
</html>
`;

export default paymentFailedEmailTemplate;

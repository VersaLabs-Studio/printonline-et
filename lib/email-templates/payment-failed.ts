export const emailTemplatePaymentFailed = (
  orderData: any,
  customerName: string,
  retryLink: string,
) => `
<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Payment Issue</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
    <p>Dear ${customerName},</p>
    
    <p>We encountered an issue processing the payment for your order <strong>${orderData.order_number}</strong>.</p>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>Payment Status:</strong> Failed<br/>
      <strong>Order Number:</strong> ${orderData.order_number}<br/>
      <strong>Amount:</strong> ETB ${orderData.total_amount}
    </div>
    
    <h3>Order Details</h3>
    <ul style="list-style: none; padding: 0;">
      ${orderData.items
        .map(
          (item: any) => `
        <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <strong>${item.product_name}</strong> (Qty: ${item.quantity}) - ETB ${item.line_total}
        </li>
      `,
        )
        .join("")}
    </ul>
    
    <hr style="margin: 20px 0;"/>
    
    <p><strong>What happened?</strong></p>
    <p>The payment could not be completed. This could be due to:</p>
    <ul>
      <li>Insufficient funds</li>
      <li>Network timeout</li>
      <li>Payment cancelled</li>
      <li>Card declined</li>
    </ul>
    
    <p><strong>Don't worry!</strong> Your order is saved and you can retry the payment at any time.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${retryLink}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Retry Payment
      </a>
    </div>
    
    <p style="text-align: center; font-size: 12px; color: #6b7280;">
      Or copy this link: <a href="${retryLink}">${retryLink}</a>
    </p>
    
    <hr style="margin: 20px 0;"/>
    
    <p><strong>Need help?</strong></p>
    <p>
      Email: <a href="mailto:support@printonline.et">support@printonline.et</a><br/>
      Phone: +251911005255<br/>
      Hours: Mon-Sat, 8:30 AM - 6:00 PM EAT
    </p>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px;">
    <p>PrintOnline.et | Addis Ababa, Ethiopia</p>
  </div>
</div>
`;

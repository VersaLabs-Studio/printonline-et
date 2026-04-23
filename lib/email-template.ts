export const emailTemplateOrderConfirmation = (
  orderData: any,
  customerName: string,
) => `
<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
  <h2>Order Confirmation - PrintOnline.et</h2>
  <p>Dear ${customerName},</p>
  <p>Thank you for your order! Your order <strong>${orderData.order_number}</strong> has been received and is currently <strong>${orderData.status}</strong>.</p>
  
  <h3>Order Summary</h3>
  <ul>
    ${orderData.items
      .map(
        (item: any) => `
      <li>
        <strong>${item.product_name}</strong> (Qty: ${item.quantity}) - ETB ${item.line_total}
        <br/><small>${Object.entries(item.selected_options || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}</small>
        ${item.design_preference === "hire_designer" ? '<br/><small style="color: #f59e0b;">+ Hire Designer Service</small>' : ""}
      </li>
    `,
      )
      .join("")}
  </ul>

  <hr/>
  <p><strong>Subtotal:</strong> ETB ${orderData.subtotal}</p>
  ${orderData.delivery_fee > 0 ? `<p><strong>Delivery:</strong> ETB ${orderData.delivery_fee}</p>` : ""}
  <p><strong>Total:</strong> ETB ${orderData.total_amount}</p>

  <p>We will notify you when the status of your order changes. If you have any questions, please contact us at order@printonline.et.</p>
</div>
`;

export const emailTemplateOrderStatusUpdate = (
  orderNumber: string,
  status: string,
  note?: string,
) => `
<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
  <h2>Order Update - PrintOnline.et</h2>
  <p>Your order <strong>${orderNumber}</strong> has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
  ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
  <p>Thank you for choosing PrintOnline.et!</p>
</div>
`;

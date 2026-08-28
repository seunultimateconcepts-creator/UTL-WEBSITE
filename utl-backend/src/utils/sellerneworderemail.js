/* eslint-disable no-undef */

/**
 * sellerNewOrderEmail
 *
 * Add this export to your existing emailTemplates.js, alongside
 * sellerApprovedEmail and the others. Fired automatically the moment
 * an order with a real vendorId is created — see orderController.js.
 *
 * ⚠️ This is the interim notification channel. True automated WhatsApp
 * alerts need the WhatsApp Business API (Meta or a provider like
 * Twilio) — a real signup + per-message cost, not buildable from a
 * plain wa.me link. Worth revisiting once you're ready to set that up.
 */
const sellerNewOrderEmail = (vendorFirstName, order) => {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; color: #e5e7eb; font-size: 13px;">${item.name}${item.quantity > 1 ? ` × ${item.quantity}` : ''}</td>
        <td style="padding: 8px 0; color: #ffffff; font-size: 13px; text-align: right;">${item.currency} ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join('')

  return `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">New Order! 📦</h1>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Hi ${vendorFirstName}, a customer just placed an order on your U-Come store. Please confirm and prepare it for delivery.
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #f5a623; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">${order.orderNumber}</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemRows}
      </table>
      <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
        <span style="color: #9ca3af; font-size: 12px; font-weight: bold;">TOTAL</span>
        <span style="color: #f5a623; font-size: 15px; font-weight: bold; float: right;">${order.items[0]?.currency || 'NGN'} ${order.totalAmount.toLocaleString()}</span>
      </div>
    </div>
    <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #f5a623; color: #0a0f2c; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      View in Dashboard →
    </a>
  </div>
  `
}

module.exports = { sellerNewOrderEmail }
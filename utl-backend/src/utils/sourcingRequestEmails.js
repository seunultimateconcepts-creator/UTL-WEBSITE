/* eslint-disable no-undef */

/**
 * Add both exports to your real emailTemplates.js, same pattern as
 * the booking email templates already there.
 */

const sourcingRequestReceivedEmail = (firstName, request) => {
  const itemLines = request.items
    .map((i) => `<li style="color: #ffffff; font-size: 13px; margin-bottom: 4px;">${i.platform}: ${i.description}</li>`)
    .join('')

  return `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">Request Received! 📦</h1>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Hi ${firstName}, we've received your sourcing request and will start working on it shortly.
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #f97316; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">${request.requestNumber}</p>
      <ul style="margin: 0; padding-left: 18px;">${itemLines}</ul>
    </div>
    <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #f97316; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      Track in Dashboard →
    </a>
  </div>
  `
}

const sourcingRequestStatusEmail = (firstName, request) => {
  const statusMessages = {
    sourcing: "We're actively sourcing your item(s) now.",
    ready: 'Your item(s) are ready!',
    completed: 'Your request is complete. Thank you!',
    cancelled: 'Your request has been cancelled.',
  }

  const fulfillmentBlock = request.status === 'ready' && request.fulfillment?.details
    ? `<div style="background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #f97316; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">How to get it</p>
        <p style="color: #ffffff; font-size: 14px;">${request.fulfillment.details}</p>
      </div>`
    : ''

  return `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">Request Update</h1>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Hi ${firstName}, ${statusMessages[request.status] || 'your request status has changed.'}
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #f97316; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">${request.requestNumber}</p>
      <p style="color: #ffffff; font-size: 14px; text-transform: capitalize;"><strong>Status:</strong> ${request.status}</p>
    </div>
    ${fulfillmentBlock}
    <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #f97316; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      View in Dashboard →
    </a>
  </div>
  `
}

module.exports = { sourcingRequestReceivedEmail, sourcingRequestStatusEmail }
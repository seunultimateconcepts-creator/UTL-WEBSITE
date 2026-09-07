/* eslint-disable no-undef */

// ✅ Gmail strips <svg> tags from HTML emails entirely (security sanitization),
// so inline SVG icons never render there even though they look fine in a
// browser preview. Using a simple colored accent bar instead — renders
// identically across every email client, no images or SVG dependency.
const ACCENT_COLORS = {
  client:  '#2563eb', // blue
  seller:  '#ea580c', // orange
  learner: '#7c3aed', // purple
  crypto:  '#16a34a', // green
}

// ✅ Feature blurbs shown in the welcome email, per account type.
const FEATURES_BY_TYPE = {
  client: [
    { title: 'Web Development', desc: 'track your projects' },
    { title: 'Shopping',        desc: 'order from any store' },
  ],
  seller: [
    { title: 'Your Shop', desc: 'list and manage your products' },
    { title: 'Orders',    desc: 'track incoming orders' },
  ],
  learner: [
    { title: 'AI Mentorship', desc: 'learn AI with Claude' },
  ],
  crypto: [
    { title: 'Crypto Mentorship', desc: 'learn to trade from scratch' },
    { title: 'Crypto Services',   desc: 'live market tracker' },
  ],
}

// ✅ Welcome email sent after signup — features shown depend on accountType
const welcomeEmail = (firstName, accountType = 'client') => {
  const features = FEATURES_BY_TYPE[accountType] || FEATURES_BY_TYPE.client
  const accent = ACCENT_COLORS[accountType] || ACCENT_COLORS.client

  const featuresHtml = features
    .map(f => `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0;">
        <tr>
          <td style="width:4px;background:${accent};border-radius:2px;"></td>
          <td style="padding-left:12px;color:#374151;font-size:14px;">
            <strong>${f.title}</strong> — ${f.desc}
          </td>
        </tr>
      </table>`)
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">

    <!-- Header -->
    <div style="background:#0a0f2c;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;">
        ULTIMATE TECH LAB
      </h1>
      <p style="color:#60a5fa;margin:8px 0 0;font-size:13px;letter-spacing:3px;">
        YOUR DIGITAL SOLUTIONS PARTNER
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px 30px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">
        Welcome aboard, ${firstName}!
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Your account has been created successfully. Here's what you now have access to:
      </p>

      <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin:0 0 24px;">
        ${featuresHtml}
      </div>

      <a href="${process.env.CLIENT_URL}/dashboard"
        style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        Go to Dashboard →
      </a>
    </div>

    <!-- Contact -->
    <div style="background:#f9fafb;padding:24px 30px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;">Need help? Reach us at:</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;">WhatsApp: +234 803 878 6037</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;">Email: hello@ultimatetechlab.com</p>
    </div>

    <!-- Footer -->
    <div style="background:#0a0f2c;padding:20px 30px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0;">
        © ${new Date().getFullYear()} Ultimate Tech Lab. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
`
}

// ✅ Email verification email
const verificationEmail = (firstName, verifyUrl) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#0a0f2c;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;">ULTIMATE TECH LAB</h1>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">
        Verify your email, ${firstName}
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Click the button below to verify your email address and activate your account.
        This link expires in <strong>24 hours</strong>.
      </p>
      <a href="${verifyUrl}"
        style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        Verify My Email →
      </a>
      <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
        If you didn't create an account, ignore this email.
      </p>
    </div>
    <div style="background:#0a0f2c;padding:20px 30px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ultimate Tech Lab.</p>
    </div>
  </div>
</body>
</html>
`

// ✅ Password reset email
const passwordResetEmail = (firstName, resetUrl) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#0a0f2c;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;">ULTIMATE TECH LAB</h1>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">
        Reset your password, ${firstName}
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
        We received a request to reset your password. Click below to set a new one.
        This link expires in <strong>1 hour</strong>.
      </p>
      <a href="${resetUrl}"
        style="display:inline-block;background:#dc2626;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        Reset My Password →
      </a>
      <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
        If you didn't request this, ignore this email. Your password won't change.
      </p>
    </div>
    <div style="background:#0a0f2c;padding:20px 30px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ultimate Tech Lab.</p>
    </div>
  </div>
</body>
</html>
`

// ✅ Booking requested confirmation email — imported by bookingController
// but never actually defined here until now; every new booking's
// confirmation email was silently failing before this.
const bookingRequestedEmail = (firstName, booking) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#0a0f2c;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;">ULTIMATE TECH LAB</h1>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">
        Booking received, ${firstName}
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
        We've received your booking request. Here's a summary:
      </p>
      <div style="background:#f9fafb;border-radius:10px;padding:20px;margin:0 0 24px;">
        <p style="color:#111827;font-size:14px;margin:0 0 8px;"><strong>Booking:</strong> ${booking.bookingNumber}</p>
        <p style="color:#111827;font-size:14px;margin:0 0 8px;"><strong>Service:</strong> ${booking.serviceType}</p>
        <p style="color:#111827;font-size:14px;margin:0 0 8px;"><strong>Scheduled:</strong> ${new Date(booking.scheduledDate).toLocaleString()}</p>
        <p style="color:#111827;font-size:14px;margin:0;"><strong>Duration:</strong> ${booking.duration}</p>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:0;">
        We'll notify you as soon as it's confirmed.
      </p>
    </div>
    <div style="background:#0a0f2c;padding:20px 30px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ultimate Tech Lab.</p>
    </div>
  </div>
</body>
</html>
`

// ✅ Booking status update email — same missing-function issue as above.
const bookingStatusUpdateEmail = (firstName, booking) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#0a0f2c;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;">ULTIMATE TECH LAB</h1>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">
        Booking update, ${firstName}
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Your booking <strong>${booking.bookingNumber}</strong> (${booking.serviceType}) is now:
      </p>
      <p style="display:inline-block;background:#0a0f2c;color:#ffffff;padding:10px 20px;border-radius:8px;font-weight:700;text-transform:capitalize;margin:0 0 24px;">
        ${booking.status}
      </p>
    </div>
    <div style="background:#0a0f2c;padding:20px 30px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ultimate Tech Lab.</p>
    </div>
  </div>
</body>
</html>
`

// ✅ Order status update email — same pattern, for the new order
// status-management admin feature.
const orderStatusUpdateEmail = (firstName, order) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#0a0f2c;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;">ULTIMATE TECH LAB</h1>
    </div>
    <div style="padding:40px 30px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">
        Order update, ${firstName}
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Your order <strong>${order.orderNumber}</strong> is now:
      </p>
      <p style="display:inline-block;background:#0a0f2c;color:#ffffff;padding:10px 20px;border-radius:8px;font-weight:700;text-transform:capitalize;margin:0 0 24px;">
        ${order.status}
      </p>
    </div>
    <div style="background:#0a0f2c;padding:20px 30px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ultimate Tech Lab.</p>
    </div>
  </div>
</body>
</html>
`

// ✅ New order notification email for the vendor — restored from the
// orphaned utils/sellerneworderemail.js, which was written to be
// merged into this file and never was. That's why every vendor
// silently never got notified of new orders since this feature
// shipped. Merged in as originally intended; orphan file removed.
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
        <span style="color: #f5a623; font-size: 15px; font-weight: bold; float: right;">${order.items[0]?.currency || 'NGN'} ${(order.grandTotal ?? order.totalAmount)?.toLocaleString()}</span>
      </div>
    </div>
    <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #f5a623; color: #0a0f2c; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      View in Dashboard →
    </a>
  </div>
  `
}

// ✅ Seller-approved email — restored from the orphaned
// utils/sellerapprovedemail.js, same never-merged issue as above.
const sellerApprovedEmail = (firstName, storeLink) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">Congratulations, ${firstName}! 🎉</h1>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Your seller application on Ultimate Tech Lab has been approved. You're now a verified vendor on U-Come.
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #f5a623; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Your store link</p>
      <a href="${storeLink}" style="color: #ffffff; font-size: 14px; word-break: break-all;">${storeLink}</a>
    </div>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Log in to your dashboard to start adding products — once you list your first one, your store link goes live and ready to share.
    </p>
    <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; background: #f5a623; color: #0a0f2c; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      Log In to Your Dashboard →
    </a>
  </div>
`

// ✅ Seller verification submission email (to admin) — restored from
// the orphaned utils/sellerVerificationEmail.js, same never-merged
// issue. Note: comment updated from the original — NIN/photos are now
// ALSO stored temporarily in the DB for the admin-panel review window
// (see verification block in models/user.js), wiped on approve/reject.
// This email remains the durable backup copy either way.
const sellerVerificationSubmittedEmail = (applicant, { nin, ninPhotoBase64, selfiePhotoBase64 }) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">New Seller Verification Submitted</h1>
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
      ${applicant.firstName} ${applicant.lastName} (${applicant.email}) submitted verification details.
      Compare the selfie against the NIMC slip photo, cross-check the name, then approve or reject
      from Admin → Pending Sellers. This email is a backup copy — the same NIN and photos are also
      visible in the admin panel until you approve or reject, then wiped from the database.
    </p>

    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <p style="color: #ffffff; font-size: 14px;"><strong>NIN:</strong> ${nin}</p>
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 8px;">
      <div style="flex: 1;">
        <p style="color: #9ca3af; font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">NIMC Slip Photo</p>
        <img src="${ninPhotoBase64}" alt="NIMC slip" style="width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" />
      </div>
      <div style="flex: 1;">
        <p style="color: #9ca3af; font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">Selfie (Liveness Check)</p>
        <img src="${selfiePhotoBase64}" alt="Selfie" style="width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" />
      </div>
    </div>

    <a href="${process.env.CLIENT_URL}/admin" style="display: inline-block; margin-top: 16px; background: #f5a623; color: #0a0f2c; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
      Review in Admin →
    </a>
  </div>
`

// ✅ Sourcing request received + status update emails — restored from
// the orphaned utils/sourcingRequestEmails.js, same never-merged issue.
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

module.exports = {
  welcomeEmail, verificationEmail, passwordResetEmail,
  bookingRequestedEmail, bookingStatusUpdateEmail,
  orderStatusUpdateEmail, sellerNewOrderEmail,
  sellerApprovedEmail, sellerVerificationSubmittedEmail,
  sourcingRequestReceivedEmail, sourcingRequestStatusEmail,
}
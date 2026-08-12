/* eslint-disable no-undef */

// ✅ Small inline SVG icons for email — email clients can't render React
// components or external icon libraries, so these are plain SVG markup
// strings, styled to match the same line-icon look used on the dashboard.
const svgIcon = (path, color = '#2563eb') => `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:8px;">
  ${path}
</svg>`

const ICON_PATHS = {
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  store: '<path d="M2 7h20l-2 5H4z"/><path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8"/><path d="M9 21v-6h6v6"/>',
  trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  graduationCap: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
}

// ✅ Feature blurbs shown in the welcome email, per account type.
const FEATURES_BY_TYPE = {
  client: [
    { icon: 'monitor', title: 'Web Development', desc: 'track your projects' },
    { icon: 'cart',    title: 'Shopping',        desc: 'order from any store' },
  ],
  seller: [
    { icon: 'store', title: 'Your Shop', desc: 'list and manage your products' },
    { icon: 'cart',  title: 'Orders',    desc: 'track incoming orders' },
  ],
  learner: [
    { icon: 'graduationCap', title: 'AI Mentorship', desc: 'learn AI with Claude' },
  ],
  crypto: [
    { icon: 'trendingUp',    title: 'Crypto Mentorship', desc: 'learn to trade from scratch' },
    { icon: 'trendingUp',    title: 'Crypto Services',   desc: 'live market tracker' },
  ],
}

// ✅ Welcome email sent after signup — features shown depend on accountType
const welcomeEmail = (firstName, accountType = 'client') => {
  const features = FEATURES_BY_TYPE[accountType] || FEATURES_BY_TYPE.client

  const featuresHtml = features
    .map(f => `
      <p style="margin:10px 0;color:#374151;font-size:14px;display:flex;align-items:center;">
        ${svgIcon(ICON_PATHS[f.icon], '#2563eb')}
        <span><strong>${f.title}</strong> — ${f.desc}</span>
      </p>`)
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
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;display:flex;align-items:center;">
        ${svgIcon(ICON_PATHS.mail, '#111827')} Verify your email, ${firstName}
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
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;display:flex;align-items:center;">
        ${svgIcon(ICON_PATHS.lock, '#111827')} Reset your password, ${firstName}
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

module.exports = { welcomeEmail, verificationEmail, passwordResetEmail }
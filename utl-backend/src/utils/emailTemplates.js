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

module.exports = { welcomeEmail, verificationEmail, passwordResetEmail }
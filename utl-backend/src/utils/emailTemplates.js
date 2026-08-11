/* eslint-disable no-undef */
// ✅ Welcome email sent after signup
const welcomeEmail = (firstName) => `
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
        Welcome aboard, ${firstName}! 🎉
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Your account has been created successfully. You now have access to all UTL features including:
      </p>

      <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="margin:8px 0;color:#374151;font-size:14px;">🖥️ <strong>Web Development</strong> — track your projects</p>
        <p style="margin:8px 0;color:#374151;font-size:14px;">💰 <strong>Crypto Services</strong> — live market tracker</p>
        <p style="margin:8px 0;color:#374151;font-size:14px;">🛒 <strong>Shopping</strong> — order from any store</p>
        <p style="margin:8px 0;color:#374151;font-size:14px;">🤖 <strong>AI Academy</strong> — learn with Claude AI</p>
      </div>

      <a href="${process.env.CLIENT_URL}/dashboard"
        style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        Go to Dashboard →
      </a>
    </div>

    <!-- Contact -->
    <div style="background:#f9fafb;padding:24px 30px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;">Need help? Reach us at:</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;">📱 WhatsApp: +234 803 878 6037</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;">✉️ Email: hello@ultimatetechlab.com</p>
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
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Verify your email, ${firstName} 📧</h2>
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
      <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Reset your password, ${firstName} 🔒</h2>
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
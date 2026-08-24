/* eslint-disable no-undef */

/**
 * sellerApprovedEmail
 *
 * Add this export to your existing emailTemplates.js, alongside
 * welcomeEmail, verificationEmail, and passwordResetEmail. Written to
 * match their pattern — swap styling to match your actual template
 * file's HTML structure/branding once you drop this in, since I don't
 * have the real file to match pixel-for-pixel.
 */
const sellerApprovedEmail = (firstName, storeLink) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 22px; margin-bottom: 8px;">Congratulations, ${firstName}! 🎉</h1>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Your seller application on Ultimate Tech Lab has been approved. You're now a verified vendor on UTL Market.
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

module.exports = { sellerApprovedEmail }
/* eslint-disable no-undef */

/**
 * Add this export to your real emailTemplates.js.
 *
 * ⚠️ This is the ONLY place NIN and BVN ever exist in this entire
 * system. They are passed into this function, rendered into this
 * email, sent once to ADMIN_EMAIL, and never written to any database
 * collection anywhere. Do not add a "save for later" step — the whole
 * point of this design is that there is nothing to breach later,
 * because nothing gets stored.
 */
const sellerVerificationSubmittedEmail = (applicant, { nin, bvn }) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">New Seller Verification Submitted</h1>
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
      ${applicant.firstName} ${applicant.lastName} (${applicant.email}) submitted verification details.
      Cross-check NIN/BVN through your own channels, then approve or reject from Admin → Pending Sellers.
      This email is the only place these numbers exist — nothing has been saved to the database.
    </p>
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
      <p style="color: #ffffff; font-size: 14px; margin-bottom: 6px;"><strong>NIN:</strong> ${nin}</p>
      <p style="color: #ffffff; font-size: 14px;"><strong>BVN:</strong> ${bvn}</p>
    </div>
  </div>
`

module.exports = { sellerVerificationSubmittedEmail }
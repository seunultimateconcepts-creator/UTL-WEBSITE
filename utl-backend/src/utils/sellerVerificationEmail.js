/* eslint-disable no-undef */

/**
 * Add this export to your real emailTemplates.js, replacing the old
 * NIN/BVN-text-only version.
 *
 * ⚠️ This is the ONLY place these photos and this NIN ever exist. They
 * arrive here as base64 strings, get embedded directly as inline
 * images in this one email, and are never written to any database
 * collection anywhere. Do not add a "save for later" step — the whole
 * point is that there is nothing to breach later, because nothing
 * gets stored.
 */
const sellerVerificationSubmittedEmail = (applicant, { nin, ninPhotoBase64, selfiePhotoBase64 }) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0f2c; padding: 32px; border-radius: 16px;">
    <h1 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">New Seller Verification Submitted</h1>
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
      ${applicant.firstName} ${applicant.lastName} (${applicant.email}) submitted verification details.
      Compare the selfie against the NIMC slip photo, cross-check the name, then approve or reject
      from Admin → Pending Sellers. This email is the only place this NIN and these photos exist —
      nothing has been saved to the database.
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

module.exports = { sellerVerificationSubmittedEmail }
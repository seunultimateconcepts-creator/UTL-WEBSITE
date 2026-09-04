/* eslint-disable no-undef */
const User = require('../models/user')
const Product = require('../models/product')
const sendEmail = require('../utils/sendEmail')
const { sellerApprovedEmail, sellerVerificationSubmittedEmail } = require('../utils/emailTemplates')
const { SUBSCRIPTION_TIERS, DELETE_COOLDOWN_DAYS } = require('../config/subscriptionTiers')
const crypto = require('crypto')

// ✅ Shared by both the frontend-callback path and the webhook — same
// logic as the existing manual updateVendorTier, just applied to the
// vendor's OWN account (from a verified payment) rather than admin
// picking a tier by hand. Never call this without having verified the
// payment first — see below.
const applyPaidTier = async (userId, tier) => {
  if (!SUBSCRIPTION_TIERS[tier] || tier === 'free') return null

  const user = await User.findById(userId)
  if (!user) return null

  const now = new Date()
  const oneYearFromNow = new Date(now)
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  user.subscription = { tier, startedAt: now, expiresAt: oneYearFromNow }
  await user.save()
  return user.subscription
}

/**
 * sellerController.js
 *
 * ✅ APPROVE SELLER — the one place sellerStatus flips to 'approved'.
 * Route this behind a shared secret for now (see ADMIN_SECRET check
 * below) since there's no real admin role system yet. Add proper
 * role-based auth once you're not the only person doing approvals.
 *
 * PATCH /api/sellers/:userId/approve
 * Header required: x-admin-key: <ADMIN_SECRET from your .env>
 *
 * Easiest way to call this today: a saved Postman/Insomnia request,
 * or a one-line curl command — doesn't need a UI to be "manual and
 * deliberate," it just needs you to consciously trigger it.
 */
const approveSeller = async (req, res) => {
  try {
    // ✅ Simple shared-secret gate. Not real auth — a placeholder until
    // you have an actual admin role. Set ADMIN_SECRET in Railway env vars.
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.sellerStatus = 'approved'
    // ✅ Review window is over — wipe the sensitive verification copy
    // immediately. The email sent at submission time remains the only
    // durable record from here on.
    user.verification.nin = ''
    user.verification.ninPhotoBase64 = ''
    user.verification.selfiePhotoBase64 = ''
    await user.save()

    const storeLink = `${process.env.CLIENT_URL}/shop/vendor/${user._id}`

    // ✅ Same non-blocking pattern as your signup emails — approval
    // itself already succeeded above, an email hiccup shouldn't undo it.
    try {
      await sendEmail({
        to: user.email,
        subject: "You're approved! Welcome to U-Come 🎉",
        html: sellerApprovedEmail(user.firstName, storeLink),
      })
    } catch (emailError) {
      console.error('Seller approval email failed (approval still applied):', emailError.message)
    }

    res.status(200).json({
      success: true,
      message: 'Seller approved and notified',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        sellerStatus: user.sellerStatus,
      },
      storeLink,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error approving seller',
      error: error.message,
    })
  }
}

/**
 * ✅ REJECT SELLER — same pattern, no email template written for this
 * yet since you'll likely want to explain why case-by-case over
 * WhatsApp rather than a generic rejection email. Add one if that
 * changes.
 */
const rejectSeller = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.sellerStatus = 'rejected'
    // ✅ Same wipe as approveSeller — review window is over either way.
    user.verification.nin = ''
    user.verification.ninPhotoBase64 = ''
    user.verification.selfiePhotoBase64 = ''
    await user.save()

    res.status(200).json({ success: true, message: 'Seller application rejected' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error rejecting seller', error: error.message })
  }
}

/**
 * ✅ LIST PENDING SELLERS — admin only, powers the approve/reject panel
 * GET /api/sellers/pending
 */
const listPendingSellers = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const pending = await User.find({ sellerStatus: 'pending' })
      .select('firstName lastName email phone createdAt vendorProfile verification.cacNumber verification.liveLocation verification.submittedAt verification.nin verification.ninPhotoBase64 verification.selfiePhotoBase64')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, sellers: pending })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching pending sellers', error: error.message })
  }
}

// ✅ LIST APPROVED VENDORS — powers a "manage subscriptions" admin
// view. Includes current slot usage so you can see at a glance who's
// close to their limit, worth an upsell nudge.
const listApprovedVendors = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const vendors = await User.find({ sellerStatus: 'approved' }).select('firstName lastName email subscription')

    const cooldownCutoff = new Date(Date.now() - DELETE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000)
    const vendorsWithUsage = await Promise.all(
      vendors.map(async (v) => {
        const slotsUsed = await Product.countDocuments({
          vendorId: v._id,
          $or: [
            { deletedAt: null, stock: { $gt: 0 } },
            { deletedAt: { $gte: cooldownCutoff } },
          ],
        })
        const tier = v.subscription?.tier || 'free'
        return {
          _id: v._id,
          firstName: v.firstName,
          lastName: v.lastName,
          email: v.email,
          subscription: v.subscription,
          slotsUsed,
          slotsLimit: SUBSCRIPTION_TIERS[tier].maxListings,
        }
      })
    )

    res.status(200).json({ success: true, vendors: vendorsWithUsage })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching vendors', error: error.message })
  }
}

// ✅ SET VENDOR TIER — manual for now, until Paystack collection is
// built. You're the one confirming payment happened (bank transfer,
// whatever) and applying the tier yourself here — same "manual now,
// automate once it's proven" pattern as everything else in this build.
// Sets a full year from today, matching the anniversary-billing model.
const updateVendorTier = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { vendorId } = req.params
    const { tier } = req.body

    if (!SUBSCRIPTION_TIERS[tier]) {
      return res.status(400).json({ success: false, message: 'Invalid tier' })
    }

    const vendor = await User.findById(vendorId)
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }

    const now = new Date()
    const oneYearFromNow = new Date(now)
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    vendor.subscription = {
      tier,
      startedAt: now,
      expiresAt: tier === 'free' ? null : oneYearFromNow,
    }
    await vendor.save()

    res.status(200).json({ success: true, subscription: vendor.subscription })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating vendor tier', error: error.message })
  }
}

// ✅ SUBMIT SELLER APPLICATION — the self-service replacement for the
// old WhatsApp-based flow. nin/ninPhotoBase64/selfiePhotoBase64 ARE
// persisted here now (review-window only — see verification block in
// user.js), plus emailed to ADMIN_EMAIL as a backup copy. Everything
// in vendorProfile/verification is fine to store — see user.js.
const submitSellerApplication = async (req, res) => {
  try {
    const {
      shopName, businessCategory, bio, shopAddress, shopPhotoUrl,
      cacNumber, lat, lng,
      nin, ninPhotoBase64, selfiePhotoBase64,
    } = req.body

    if (!shopName || !bio || !shopAddress || !shopPhotoUrl) {
      return res.status(400).json({ success: false, message: 'Shop name, bio, shop address, and shop photo are required' })
    }
    if (!nin || !ninPhotoBase64 || !selfiePhotoBase64) {
      return res.status(400).json({ success: false, message: 'NIN, NIMC photo, and selfie are all required for verification' })
    }
    if (lat == null || lng == null) {
      return res.status(400).json({ success: false, message: 'Live location is required for verification' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if (user.sellerStatus === 'approved') {
      return res.status(400).json({ success: false, message: 'You are already an approved seller' })
    }

    user.vendorProfile = { shopName, businessCategory: businessCategory || 'Product Seller', bio, shopAddress, shopPhotoUrl }
    user.verification = {
      cacNumber: cacNumber || '',
      liveLocation: { lat, lng },
      submittedAt: new Date(),
      // ✅ Review-window only — wiped by approveSeller/rejectSeller
      nin,
      ninPhotoBase64,
      selfiePhotoBase64,
    }
    user.sellerStatus = 'pending'
    await user.save()

    // ✅ Backup/audit copy — DB copy above is temporary and gets wiped
    // on approve/reject, so this email is the durable record.
    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `Seller Verification: ${user.firstName} ${user.lastName}`,
          html: sellerVerificationSubmittedEmail(user, { nin, ninPhotoBase64, selfiePhotoBase64 }),
        })
      } else {
        console.error('ADMIN_EMAIL not set — verification submitted but admin was not notified with NIN/BVN')
      }
    } catch (emailError) {
      console.error('Verification email failed (application still recorded):', emailError.message)
    }

    res.status(200).json({ success: true, sellerStatus: user.sellerStatus })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error submitting application', error: error.message })
  }
}

// ✅ VERIFY SUBSCRIPTION PAYMENT — called by the frontend right after
// Paystack's popup closes successfully. This is NOT what actually
// grants the tier by itself — it calls Paystack's own verify-
// transaction endpoint server-side and only applies the tier if
// Paystack confirms the payment genuinely succeeded AND the amount
// paid matches the real tier price. Never trust a client-reported
// "it worked" on its own.
const verifySubscriptionPayment = async (req, res) => {
  try {
    const { reference } = req.body
    if (!reference) {
      return res.status(400).json({ success: false, message: 'Missing payment reference' })
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = await verifyRes.json()

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment could not be verified' })
    }

    const { tier } = verifyData.data.metadata || {}
    const expectedKobo = SUBSCRIPTION_TIERS[tier]?.price * 100

    if (!tier || !expectedKobo || verifyData.data.amount !== expectedKobo) {
      return res.status(400).json({ success: false, message: 'Payment amount does not match the selected plan' })
    }

    const subscription = await applyPaidTier(req.user.id, tier)
    if (!subscription) {
      return res.status(400).json({ success: false, message: 'Could not apply tier — invalid account or plan' })
    }

    res.status(200).json({ success: true, subscription })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error verifying payment', error: error.message })
  }
}

// ✅ PAYSTACK WEBHOOK — the reliability backstop. If someone closes
// their browser the instant after paying (before the frontend callback
// above ever fires), this is what still applies the tier. Verified via
// HMAC signature over the RAW request body — see server.js for the
// req.rawBody change this depends on.
const paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature']
    const expectedSignature = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest('hex')

    if (signature !== expectedSignature) {
      return res.status(401).json({ success: false, message: 'Invalid signature' })
    }

    const event = req.body
    if (event.event === 'charge.success') {
      const { tier, userId } = event.data.metadata || {}
      const expectedKobo = SUBSCRIPTION_TIERS[tier]?.price * 100

      if (tier && userId && event.data.amount === expectedKobo) {
        await applyPaidTier(userId, tier)
      }
    }

    // ✅ Always 200 — Paystack retries on non-200, and we've already
    // handled (or deliberately ignored) whatever it sent
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error.message)
    res.status(200).json({ received: true }) // still 200 — don't trigger Paystack retries over our own bug
  }
}

module.exports = {
  approveSeller, rejectSeller, listPendingSellers, listApprovedVendors, updateVendorTier,
  submitSellerApplication, verifySubscriptionPayment, paystackWebhook,
}
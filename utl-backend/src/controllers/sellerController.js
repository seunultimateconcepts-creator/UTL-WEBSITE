/* eslint-disable no-undef */
const User = require('../models/user')
const Product = require('../models/product')
const sendEmail = require('../utils/sendEmail')
const { sellerApprovedEmail } = require('../utils/emailTemplates')
const { SUBSCRIPTION_TIERS, DELETE_COOLDOWN_DAYS } = require('../config/subscriptionTiers')

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
      .select('firstName lastName email phone createdAt')
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

module.exports = { approveSeller, rejectSeller, listPendingSellers, listApprovedVendors, updateVendorTier }
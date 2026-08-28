/* eslint-disable no-undef */
const User = require('../models/user')
const sendEmail = require('../utils/sendEmail')
const { sellerApprovedEmail } = require('../utils/emailTemplates')

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

module.exports = { approveSeller, rejectSeller, listPendingSellers }
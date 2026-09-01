/* eslint-disable no-undef */
const User = require('../models/user')

/**
 * blockSellerCustomerActions
 *
 * ✅ Applied after `protect` on every action that represents "acting as
 * a customer" — placing an order, submitting a sourcing request,
 * booking a service, starting a conversation as a buyer. An approved
 * seller account is locked to Dashboard + their own shop page; if they
 * want to shop, they use a genuinely different account (a different
 * email, since email is the unique login identifier here).
 *
 * This is the REAL boundary — it doesn't matter whether the frontend
 * successfully hides the "Place Order" button, since this runs
 * regardless of what UI a request came from.
 */
const blockSellerCustomerActions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('sellerStatus')
    if (user?.sellerStatus === 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Seller accounts cannot shop, book services, or message as a customer. Sign up with a different account to buy.',
      })
    }
    next()
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking account status', error: error.message })
  }
}

module.exports = blockSellerCustomerActions
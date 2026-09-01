/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  approveSeller, rejectSeller, listPendingSellers, listApprovedVendors, updateVendorTier,
  submitSellerApplication, verifySubscriptionPayment, paystackWebhook,
} = require('../controllers/sellerController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Self-service — a logged-in user applying to become a seller, or
// an already-approved seller paying for a tier upgrade. Both JWT-
// protected (protect), NOT admin-key protected — the applicant/vendor
// acting on their own account.
router.post('/apply', protect, submitSellerApplication)             // POST /api/sellers/apply
router.post('/verify-payment', protect, verifySubscriptionPayment)  // POST /api/sellers/verify-payment

// ✅ Paystack calls this directly — no user session exists here at
// all. Verified via HMAC signature inside the controller instead.
router.post('/paystack-webhook', paystackWebhook)                   // POST /api/sellers/paystack-webhook

// ✅ Admin key — checked inside each controller function via x-admin-key
// header, not user auth. See sellerController.js.
router.get('/pending', listPendingSellers)          // GET /api/sellers/pending
router.get('/vendors', listApprovedVendors)         // GET /api/sellers/vendors
router.patch('/:userId/approve', approveSeller)      // PATCH /api/sellers/:userId/approve
router.patch('/:userId/reject', rejectSeller)        // PATCH /api/sellers/:userId/reject
router.patch('/:userId/tier', updateVendorTier)      // PATCH /api/sellers/:userId/tier

module.exports = router
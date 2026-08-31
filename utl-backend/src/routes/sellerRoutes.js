/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { approveSeller, rejectSeller, listPendingSellers, listApprovedVendors, updateVendorTier } = require('../controllers/sellerController')

// ✅ Admin key — checked inside each controller function via x-admin-key
// header, not user auth. See sellerController.js.
router.get('/pending', listPendingSellers)          // GET /api/sellers/pending
router.get('/vendors', listApprovedVendors)         // GET /api/sellers/vendors
router.patch('/:userId/approve', approveSeller)      // PATCH /api/sellers/:userId/approve
router.patch('/:userId/reject', rejectSeller)        // PATCH /api/sellers/:userId/reject
router.patch('/:userId/tier', updateVendorTier)      // PATCH /api/sellers/:userId/tier

module.exports = router
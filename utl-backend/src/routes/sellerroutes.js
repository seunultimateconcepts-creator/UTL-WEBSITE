/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { approveSeller, rejectSeller, listPendingSellers } = require('../controllers/sellerController')

// ✅ Admin key — checked inside each controller function via x-admin-key
// header, not user auth. See sellerController.js.
router.get('/pending', listPendingSellers)          // GET /api/sellers/pending
router.patch('/:userId/approve', approveSeller)      // PATCH /api/sellers/:userId/approve
router.patch('/:userId/reject', rejectSeller)        // PATCH /api/sellers/:userId/reject

module.exports = router
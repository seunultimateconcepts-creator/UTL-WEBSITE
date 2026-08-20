/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const inquiryController = require('../controllers/inquiryController')
const { protect } = require('../middleware/authMiddleware')

// ✅ All inquiry routes require login — buyer or vendor
router.get('/vendor-inbox', protect, inquiryController.getVendorInbox) // GET /api/inquiries/vendor-inbox
router.get('/:inquiryId', protect, inquiryController.getThread)         // GET /api/inquiries/:inquiryId
router.patch('/:inquiryId/escalate', protect, inquiryController.escalate)         // PATCH /api/inquiries/:inquiryId/escalate
router.post('/:inquiryId/vendor-reply', protect, inquiryController.vendorReply)   // POST /api/inquiries/:inquiryId/vendor-reply
router.post('/:inquiryId/buyer-reply', protect, inquiryController.buyerReply)     // POST /api/inquiries/:inquiryId/buyer-reply

module.exports = router
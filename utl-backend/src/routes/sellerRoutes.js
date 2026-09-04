/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { createRequest, getMyRequests, listAllRequests, updateItemProof, updateRequestStatus } = require('../controllers/sourcingRequestController')
const { protect } = require('../middleware/authMiddleware')
const blockSellerCustomerActions = require('../middleware/blockSellerCustomerActions')

// ✅ Static paths before dynamic ones
router.get('/all', listAllRequests)                                    // GET /api/sourcing-requests/all (admin key)
router.get('/my-requests', protect, getMyRequests)                     // GET /api/sourcing-requests/my-requests
router.post('/', protect, blockSellerCustomerActions, createRequest)   // POST /api/sourcing-requests
router.patch('/:requestId/items/:itemIndex/proof', updateItemProof)    // PATCH /api/sourcing-requests/:requestId/items/:itemIndex/proof (admin key)
router.patch('/:requestId/status', updateRequestStatus)                // PATCH /api/sourcing-requests/:requestId/status (admin key)

module.exports = router
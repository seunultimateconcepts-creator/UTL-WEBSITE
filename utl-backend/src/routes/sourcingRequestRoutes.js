/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  createRequest, getMyRequests, listAllRequests, updateItemProof, updateRequestStatus,
} = require('../controllers/sourcingRequestController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Static paths before dynamic ones — same rule as every other routes file
router.get('/all', listAllRequests)                       // GET /api/sourcing-requests/all (admin key)
router.get('/my-requests', protect, getMyRequests)        // GET /api/sourcing-requests/my-requests
router.post('/', protect, createRequest)                  // POST /api/sourcing-requests
router.patch('/:requestId/status', updateRequestStatus)   // PATCH /api/sourcing-requests/:requestId/status (admin key)
router.patch('/:requestId/items/:itemIndex/proof', updateItemProof) // PATCH .../items/:itemIndex/proof (admin key)

module.exports = router
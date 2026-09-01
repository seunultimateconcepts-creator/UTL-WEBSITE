/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  getOrCreateConversation, getMyConversations, getMessages, sendMessage,
  adminGetConversationForRequest, adminGetMessages, adminSendMessage,
} = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')
const blockSellerCustomerActions = require('../middleware/blockSellerCustomerActions')

// ✅ Buyer/vendor side — JWT protected
router.get('/conversations', protect, getMyConversations)
router.post('/conversations', protect, blockSellerCustomerActions, getOrCreateConversation)
router.get('/conversations/:conversationId/messages', protect, getMessages)
router.post('/conversations/:conversationId/messages', protect, sendMessage)

// ✅ Admin side — x-admin-key protected, checked inside each controller
// function, same pattern as every other admin endpoint in this build.
// Static path before dynamic ones, same rule as always.
router.get('/admin/sourcing/:sourcingRequestId/conversation', adminGetConversationForRequest)
router.get('/admin/conversations/:conversationId/messages', adminGetMessages)
router.post('/admin/conversations/:conversationId/messages', adminSendMessage)

module.exports = router
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  getOrCreateConversation, getMyConversations, getMessages, sendMessage,
} = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')

router.get('/conversations', protect, getMyConversations)                          // GET /api/messages/conversations
router.post('/conversations', protect, getOrCreateConversation)                    // POST /api/messages/conversations
router.get('/conversations/:conversationId/messages', protect, getMessages)        // GET /api/messages/conversations/:id/messages
router.post('/conversations/:conversationId/messages', protect, sendMessage)       // POST /api/messages/conversations/:id/messages

module.exports = router
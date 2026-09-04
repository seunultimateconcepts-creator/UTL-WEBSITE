/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { sendChatMessage } = require('../controllers/chatbotController')

// ✅ Public — no login required, matches the floating chat widget
// being usable by any visitor. Rate-limited inside the controller.
router.post('/message', sendChatMessage)   // POST /api/chatbot/message

module.exports = router
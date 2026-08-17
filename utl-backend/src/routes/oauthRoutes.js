/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { googleAuth, completeProfile } = require('../controllers/oauthController')
const { protect } = require('../middleware/authMiddleware')

// ✅ POST /api/auth/oauth/google
router.post('/google', googleAuth)

// ✅ PATCH /api/auth/oauth/complete-profile — requires a valid token,
// used once right after a new Google/Facebook signup
router.patch('/complete-profile', protect, completeProfile)

module.exports = router
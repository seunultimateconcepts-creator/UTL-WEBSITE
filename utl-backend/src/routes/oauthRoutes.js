/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { googleAuth, facebookAuth, completeProfile } = require('../controllers/oauthController')
const { protect } = require('../middleware/authMiddleware')

// ✅ POST /api/auth/oauth/google
router.post('/google', googleAuth)

// ✅ POST /api/auth/oauth/facebook
router.post('/facebook', facebookAuth)

// ✅ PATCH /api/auth/oauth/complete-profile
router.patch('/complete-profile', protect, completeProfile)

module.exports = router
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { googleAuth, facebookAuth } = require('../controllers/oauthController')

// ✅ POST /api/auth/oauth/google
router.post('/google', googleAuth)

// ✅ POST /api/auth/oauth/facebook
router.post('/facebook', facebookAuth)

// ✅ /complete-profile route removed — it belonged to the old
// accountType picker flow, which no longer exists. OAuth sign-in now
// works exactly like normal email signup, no extra step needed.

module.exports = router
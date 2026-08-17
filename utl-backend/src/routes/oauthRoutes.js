/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { googleAuth } = require('../controllers/oauthController')

// ✅ POST /api/auth/oauth/google
router.post('/google', googleAuth)

module.exports = router
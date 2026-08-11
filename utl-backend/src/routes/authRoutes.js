/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Public routes
router.post('/signup', signup)
router.get('/verify-email/:token', verifyEmail)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

// ✅ Protected routes
router.get('/me', protect, getMe)

module.exports = router
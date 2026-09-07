/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { getMyNotifications, markNotificationRead, markAllNotificationsRead } = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Static paths before dynamic ones — same ordering rule as
// everywhere else in this backend.
router.get('/', protect, getMyNotifications)                          // GET /api/notifications
router.patch('/read-all', protect, markAllNotificationsRead)          // PATCH /api/notifications/read-all
router.patch('/:notificationId/read', protect, markNotificationRead)  // PATCH /api/notifications/:notificationId/read

module.exports = router
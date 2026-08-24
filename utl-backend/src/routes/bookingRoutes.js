/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { createBooking, getMyBookings, listAllBookings, updateBookingStatus } = require('../controllers/bookingController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Static paths before dynamic ones
router.get('/all', listAllBookings)                    // GET /api/bookings/all (admin key)
router.get('/my-bookings', protect, getMyBookings)      // GET /api/bookings/my-bookings
router.post('/', protect, createBooking)                // POST /api/bookings
router.patch('/:bookingId/status', updateBookingStatus) // PATCH /api/bookings/:bookingId/status (admin key)

module.exports = router
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { createBooking, getMyBookings, listAllBookings, updateBookingStatus } = require('../controllers/bookingController')
const { protect } = require('../middleware/authMiddleware')
const blockSellerCustomerActions = require('../middleware/blockSellerCustomerActions')

// ✅ Static paths before dynamic ones
router.get('/all', listAllBookings)                    // GET /api/bookings/all (admin key)
router.get('/my-bookings', protect, getMyBookings)      // GET /api/bookings/my-bookings
router.post('/', protect, blockSellerCustomerActions, createBooking) // POST /api/bookings
router.patch('/:bookingId/status', updateBookingStatus) // PATCH /api/bookings/:bookingId/status (admin key)

module.exports = router
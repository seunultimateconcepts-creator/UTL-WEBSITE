/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Booking
 *
 * Deliberately SEPARATE from Order — see the architecture discussion:
 * products are about quantity/delivery, services are about TIME. This
 * covers Web Development consultations, Crypto Mentorship sessions,
 * Shopping Assistance consults, and anything hotel-booking-style added
 * later. Uses the same Counter.js atomic sequence as Order, but with a
 * 'booking' key and BK- prefix so the two never collide.
 *
 * No vendorId here on purpose — these are all UTL's own direct
 * services (not something U-Come vendors offer), same category as
 * Ultimate Shop being UTL's own catalog. assignedTo defaults to null,
 * meaning "you" — only becomes meaningful once there's actual staff.
 */
const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceType: {
    type: String,
    required: true, // 'Web Development', 'Crypto Mentorship', 'Shopping Assistance', etc.
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String, // e.g. '1 hour', '30 minutes' — free text, not worth over-engineering yet
    default: '1 hour',
  },
  notes: {
    type: String,
    default: '',
  },
  contactPhone: {
    type: String,
    required: true,
  },
  // ✅ requested → confirmed → in-progress → completed → cancelled.
  // Deliberately different stages from Order's status — a booking
  // doesn't get "delivered," it gets "completed."
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'requested',
  },
  // ✅ null = you handle it. Only meaningful once there's real staff.
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
})

const Booking = mongoose.model('Booking', bookingSchema)
module.exports = Booking
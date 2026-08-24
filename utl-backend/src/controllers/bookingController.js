/* eslint-disable no-undef */
const Booking = require('../models/booking')
const User = require('../models/user')
const { getNextSequence } = require('../models/counter')
const sendEmail = require('../utils/sendEmail')
const { bookingRequestedEmail, bookingStatusUpdateEmail } = require('../utils/emailTemplates')

// ✅ BK-2026-00001 style — same atomic Counter as Order, different key
// so the two sequences never collide or share numbers.
const generateBookingNumber = async () => {
  const year = new Date().getFullYear()
  const seq = await getNextSequence('booking')
  return `BK-${year}-${String(seq).padStart(5, '0')}`
}

// ✅ CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const customerId = req.user.id
    const { serviceType, scheduledDate, duration, notes, contactPhone } = req.body

    if (!serviceType || !scheduledDate || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Service type, date, and phone are required' })
    }

    const bookingNumber = await generateBookingNumber()

    const booking = await Booking.create({
      bookingNumber,
      customerId,
      serviceType,
      scheduledDate,
      duration: duration || '1 hour',
      notes: notes || '',
      contactPhone,
    })

    // ✅ Booking a service is just as much real engagement as ordering
    // a product — same dashboardUnlocked trigger, same principle.
    const customer = await User.findById(customerId)
    if (customer && !customer.dashboardUnlocked) {
      customer.dashboardUnlocked = true
      await customer.save()
    }

    // Non-blocking confirmation email
    try {
      if (customer?.email) {
        await sendEmail({
          to: customer.email,
          subject: `Booking Received: ${booking.bookingNumber}`,
          html: bookingRequestedEmail(customer.firstName, booking),
        })
      }
    } catch (emailError) {
      console.error('Booking confirmation email failed (booking still created):', emailError.message)
    }

    res.status(201).json({ success: true, booking })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating booking', error: error.message })
  }
}

// ✅ MY BOOKINGS — powers the client dashboard's Projects tab
const getMyBookings = async (req, res) => {
  try {
    const customerId = req.user.id
    const bookings = await Booking.find({ customerId }).sort({ scheduledDate: -1 })
    res.status(200).json({ success: true, bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching bookings', error: error.message })
  }
}

// ✅ ADMIN — list all bookings (same x-admin-key pattern as orders/products/sellers)
const listAllBookings = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const bookings = await Booking.find()
      .populate('customerId', 'firstName lastName email')
      .sort({ scheduledDate: 1 })

    res.status(200).json({ success: true, bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching bookings', error: error.message })
  }
}

// ✅ ADMIN — update booking status, fires the status-change email
const updateBookingStatus = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { bookingId } = req.params
    const { status } = req.body

    const validStatuses = ['requested', 'confirmed', 'in-progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    booking.status = status
    await booking.save()

    try {
      const customer = await User.findById(booking.customerId)
      if (customer?.email) {
        await sendEmail({
          to: customer.email,
          subject: `Booking Update: ${booking.bookingNumber}`,
          html: bookingStatusUpdateEmail(customer.firstName, booking),
        })
      }
    } catch (emailError) {
      console.error('Booking status email failed (status still updated):', emailError.message)
    }

    res.status(200).json({ success: true, booking })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating booking', error: error.message })
  }
}

module.exports = { createBooking, getMyBookings, listAllBookings, updateBookingStatus }
/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Notification
 *
 * In-app notifications — the bell icon in the dashboard. Deliberately
 * simple: one flat collection, one recipient per document (no
 * broadcast/fan-out model needed at this scale). Created via the
 * createNotification() helper in utils/notify.js from inside existing
 * controllers at the moment something notification-worthy happens
 * (order status change, booking status change, sourcing request status
 * change, seller approved/rejected) — never created directly from a
 * route, so there's one place (notify.js) that owns the shape.
 *
 * `link` is a frontend route (e.g. '/dashboard?tab=orders') so clicking
 * a notification can take the user straight to the relevant tab.
 */
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['order', 'booking', 'sourcing-request', 'seller-status', 'message', 'general'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// ✅ Powers "my notifications, newest first" and the unread-count
// query — both filter/sort by userId + createdAt or userId + read.
notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, read: 1 })

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification
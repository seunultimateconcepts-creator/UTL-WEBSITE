/* eslint-disable no-undef */
const Notification = require('../models/notification')

/**
 * createNotification — the ONE place a Notification document ever
 * gets created. Same non-blocking philosophy as sendEmail(): calling
 * code wraps this in try/catch and never lets a notification failure
 * undo the real action (status already changed, order already placed)
 * that triggered it.
 *
 * Usage: await createNotification({
 *   userId: order.buyerId,
 *   type: 'order',
 *   title: 'Order update',
 *   message: `Your order ${order.orderNumber} is now delivered.`,
 *   link: '/dashboard?tab=orders',
 * })
 */
const createNotification = async ({ userId, type, title, message, link = '' }) => {
  if (!userId || !type || !title || !message) {
    throw new Error('createNotification requires userId, type, title, and message')
  }
  return Notification.create({ userId, type, title, message, link })
}

module.exports = { createNotification }
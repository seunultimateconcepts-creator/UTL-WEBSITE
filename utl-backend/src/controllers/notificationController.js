/* eslint-disable no-undef */
const Notification = require('../models/notification')

// ✅ LIST — newest first, capped at 50. This is a bell-icon dropdown,
// not an inbox — nobody needs to page through years of notifications
// here, and capping keeps the payload small on every dashboard load.
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false })

    res.status(200).json({ success: true, notifications, unreadCount })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching notifications', error: error.message })
  }
}

// ✅ MARK ONE READ — scoped to req.user.id in the query itself (not
// just fetched-then-checked) so there's no way to mark someone else's
// notification read by guessing an ID.
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user.id },
      { read: true },
      { new: true }
    )
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }
    res.status(200).json({ success: true, notification })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating notification', error: error.message })
  }
}

// ✅ MARK ALL READ — powers the "mark all as read" action in the
// dropdown footer.
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true })
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating notifications', error: error.message })
  }
}

module.exports = { getMyNotifications, markNotificationRead, markAllNotificationsRead }
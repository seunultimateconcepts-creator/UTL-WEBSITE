/* eslint-disable no-undef */
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  // ✅ Unambiguous label for who sent it, independent of senderId —
  // needed because admin messages have no real User document behind
  // them (admin authenticates with a shared key, not a login).
  senderRole: {
    type: String,
    enum: ['buyer', 'vendor', 'admin'],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null only for admin-sent messages
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Message', messageSchema)
/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Conversation
 *
 * ✅ Deliberately OPEN direct messaging now, not AI-gated like
 * ProductChat/Inquiry — that restriction existed to prevent easy
 * off-platform drift back when UTL was still weighing payment
 * mediation. Since the decision landed on "no payment mediation,
 * vendors and customers handle transactions directly anyway," gating
 * conversation while the trade itself happens off-platform regardless
 * was protecting against a risk that's already been accepted
 * elsewhere. ProductChat/Inquiry still exist for instant AI-answered
 * questions — this is the separate "actually talk to the seller" layer.
 */
const conversationSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  lastMessagePreview: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

// ✅ One thread per buyer/vendor/product combo — reused on every
// return visit rather than spawning duplicate conversations.
conversationSchema.index({ buyerId: 1, vendorId: 1, productId: 1 }, { unique: true })

module.exports = mongoose.model('Conversation', conversationSchema)
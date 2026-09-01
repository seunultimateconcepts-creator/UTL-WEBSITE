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
  // ✅ null for sourcing-request conversations — the "other side" there
  // is admin, not a real vendor User account
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  // ✅ Ultimate Concepts conversations — set instead of productId/vendorId
  sourcingRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingRequest',
    default: null,
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

// ✅ Two SEPARATE partial unique indexes, not one — a conversation is
// either about a product (buyer+vendor+product) or a sourcing request
// (buyer+request), never both, so each gets its own uniqueness rule.
conversationSchema.index(
  { buyerId: 1, vendorId: 1, productId: 1 },
  { unique: true, partialFilterExpression: { productId: { $type: 'objectId' } } }
)
conversationSchema.index(
  { buyerId: 1, sourcingRequestId: 1 },
  { unique: true, partialFilterExpression: { sourcingRequestId: { $type: 'objectId' } } }
)

module.exports = mongoose.model('Conversation', conversationSchema)
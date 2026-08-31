/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * SourcingRequest
 *
 * Deliberately SEPARATE from Order. An Order is "I am buying a known,
 * priced thing right now" (a real vendor's Product). A SourcingRequest
 * is "please go get this for me" — price unknown until you've actually
 * sourced it, no fixed delivery-zone fee, no upfront fulfillment choice.
 *
 * Fulfillment is decided AD HOC by whoever processes the request, once
 * they know what was actually available where — that's why `fulfillment`
 * lives on the request itself (filled in later), not chosen by the
 * customer at creation.
 */
const requestItemSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // 'Jumia', 'Jiji', 'Temu', 'AliExpress', 'CDCare', 'Amazon', 'eBay', etc.
  description: { type: String, required: true },
  referenceImageUrl: { type: String, default: '' }, // Cloudinary URL, optional
  budget: { type: Number, default: null }, // customer's stated budget — NOT a price, just a hint

  // ✅ Filled in by admin once actually sourced — this is the proof/
  // tracking layer. Nothing here at creation time.
  sourcingProof: {
    screenshotUrl: { type: String, default: '' }, // Cloudinary
    externalOrderNumber: { type: String, default: '' }, // Jumia/Temu's own order ref
    actualPrice: { type: Number, default: null },
  },
}, { _id: false })

const sourcingRequestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [requestItemSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '', // customer can mention preferred area/pickup vs delivery interest here, informally
  },
  // ✅ pending → sourcing → ready → completed. 'ready' means it's
  // physically arrived and awaiting whatever fulfillment gets chosen.
  status: {
    type: String,
    enum: ['pending', 'sourcing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  // ✅ Filled in by admin at the 'ready' stage, once they actually know
  // what's practical for this specific order — see the four-path
  // discussion: platform-delivery, platform-pickup, utl-pickup, utl-delivery.
  fulfillment: {
    method: {
      type: String,
      enum: ['platform-delivery', 'platform-pickup', 'utl-pickup', 'utl-delivery', null],
      default: null,
    },
    details: { type: String, default: '' }, // free text — station name, address, whatever's relevant
  },
}, {
  timestamps: true,
})

const SourcingRequest = mongoose.model('SourcingRequest', sourcingRequestSchema)
module.exports = SourcingRequest
/* eslint-disable no-undef */
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'NGN',
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: [{
    type: String,
  }],
  // ✅ Vendor-authored FAQs — this is what actually grounds the AI chatbot.
  // The more detail a vendor puts here, the fewer questions escalate to
  // them personally. Worth surfacing this as a "the more you fill in,
  // the fewer messages you have to answer yourself" pitch in the seller UI.
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
  }],
  policies: {
    delivery: { type: String, default: '' },
    returns: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'out_of_stock'],
    default: 'active',
  },
  // ✅ Platinum-only, enforced in the controller against
  // subscriptionTiers.js — not a schema-level restriction, since the
  // tier a vendor's ON can change over time independent of the schema.
  videoUrl: {
    type: String,
    default: '',
  },
  // ✅ Soft delete, deliberately NOT a real deletion. A manually
  // deleted product still counts against the vendor's tier limit for
  // DELETE_COOLDOWN_DAYS (see subscriptionTiers.js) — this is what
  // stops delete-and-relist from being a way to dodge the cap. A
  // product that sells out (stock hits 0) is NOT touched by this field
  // at all — that's legitimate turnover and frees its slot immediately.
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
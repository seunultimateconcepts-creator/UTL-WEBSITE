/* eslint-disable no-undef */
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['buyer', 'vendor', 'ai'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // ✅ True if this message had contact info stripped out of it before
  // being stored/shown. Lets you audit filter behavior and spot repeat
  // offenders without having to read every message.
  wasFiltered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false })

const inquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
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
  // ✅ ai_active: bot is answering, no human involved yet.
  // escalated: buyer asked for the vendor, vendor can now see + reply.
  // resolved: buyer or vendor marked it done.
  status: {
    type: String,
    enum: ['ai_active', 'escalated', 'resolved'],
    default: 'ai_active',
  },
  messages: [messageSchema],
  // ✅ Running count of filtered (contact-sharing) attempts in this
  // thread, from EITHER side. Check this before deciding whether to
  // flag a vendor's sellerStatus for manual review.
  flagCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

// ✅ One thread per buyer+product pair — reuse it across visits
// instead of creating a new thread every time they reopen the chat.
inquirySchema.index({ productId: 1, buyerId: 1 }, { unique: true })

const Inquiry = mongoose.model('Inquiry', inquirySchema)
module.exports = Inquiry
/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Order
 *
 * Two order sources currently exist on the Platform:
 *  1. Ultimate Shop — hardcoded catalog in UTLShopStore.jsx, NOT backed
 *     by real Product documents.
 *  2. U Market vendor products — real Product documents with a real
 *     vendorId.
 *
 * Rather than forcing Ultimate Shop's catalog into the Product model
 * right now (a bigger migration than this needs), productSnapshot
 * stores the product's name/price/currency directly on the order. This
 * means the order stays accurate forever even if the underlying
 * product/price changes or is deleted later — standard e-commerce
 * practice (you never want an old order to silently change because
 * someone edited the product).
 *
 * vendorId is null for Ultimate Shop orders (it's UTL's own service,
 * not a real seller account) and set for real U Market vendor orders.
 */
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // ✅ null = Ultimate Shop (UTL itself), set = a real U Market vendor
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // ✅ null for Ultimate Shop items (not real Product documents yet)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  productSnapshot: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    store: { type: String, default: '' }, // e.g. 'Jumia' for Ultimate Shop items
  },
  quantity: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'],
    default: 'pending',
  },
  // ✅ Optional for now — the checkout/address flow isn't built yet,
  // orders are still coordinated via WhatsApp. Fill this in once the
  // real checkout flow (Address model + delivery form) exists.
  deliveryAddress: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
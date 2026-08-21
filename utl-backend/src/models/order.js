/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Order
 *
 * ✅ Now supports MULTIPLE items per order (a real cart checkout),
 * not just one product per order. This matters most for Ultimate
 * Shop, where a customer might order a phone AND a laptop in one
 * checkout — previously that would have needed two separate orders.
 *
 * Each item keeps its own denormalized snapshot (name/price/store) for
 * the same reason as before: an order should never silently change if
 * the underlying product/price is edited or deleted later.
 *
 * vendorId stays at the ORDER level, not per-item — a single order is
 * still tied to one vendor (or null for Ultimate Shop). Cross-vendor
 * carts aren't supported; each vendor's items would need a separate
 * order, same as most real marketplaces (Amazon, Jumia) handle it.
 */
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  store: { type: String, default: '' }, // e.g. 'Jumia' for Ultimate Shop items
  quantity: { type: Number, default: 1 },
}, { _id: false })

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
  items: {
    type: [orderItemSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  totalAmount: {
    type: Number,
    required: true,
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
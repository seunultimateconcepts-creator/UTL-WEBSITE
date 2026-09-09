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
  // ✅ null = Ultimate Shop (UTL itself), set = a real U-Come vendor
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
  // ✅ Structured, not a free-text string — makes delivery fee/time
  // calculation possible, and is what the vendor/admin needs to
  // actually ship the order. NOT required at the schema level anymore
  // — bookingDetails (below) is the alternative for date-based
  // categories (hotel stays, property viewings, event dates) where a
  // shipping address doesn't apply. orderController enforces "exactly
  // one of deliveryAddress or bookingDetails must be present" instead.
  deliveryAddress: {
    fullName: { type: String },
    phone: { type: String },
    coverageZone: { type: String },
    address: { type: String },
    landmark: { type: String, default: '' },
  },
  // ✅ For Hotel & Short-Let, Property & Real Estate, Events &
  // Entertainment, Travel & Tour Booking — a reservation needs dates,
  // not a delivery address. Deliberately minimal (no availability
  // calendar, no double-booking prevention yet) — startDate covers a
  // property viewing or single-day event; endDate is only meaningful
  // for a hotel stay's checkout date.
  bookingDetails: {
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    guests: { type: Number, default: null },
    details: { type: String, default: '' },
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0,
  },
  estimatedDeliveryDays: {
    type: String,
    default: '',
  },
  // ✅ items total + deliveryFee — what the customer actually pays
  grandTotal: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
  },
  // ✅ Manual bank-transfer flow — see utils/notify.js and
  // confirmOrderPayment in orderController.js. UTL never touches the
  // money (per the no-payment-mediation decision); this just tracks
  // whether the VENDOR has confirmed receiving the buyer's transfer.
  // 'unpaid' until the vendor (or admin, for Ultimate Shop orders)
  // explicitly confirms — there is no buyer-side "I've paid" click,
  // since the vendor is the one who can actually see their bank alert.
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'confirmed'],
    default: 'unpaid',
  },
  paymentConfirmedAt: {
    type: Date,
    default: null,
  },
  // ✅ Set by the BUYER via confirmDelivery — separate from
  // status:'delivered' (which the vendor/admin sets when they ship
  // it). This is the customer's own "yes, I received it" signal.
  customerConfirmedAt: {
    type: Date,
    default: null,
  },
  // ✅ Return request — buyer-initiated (requestReturn), vendor/admin
  // resolved (resolveReturn). Deliberately simple: one return request
  // per order, no partial-item returns, no refund processing (UTL
  // doesn't hold the money — same no-payment-mediation principle as
  // everywhere else — so a refund is a conversation between buyer and
  // vendor, this just tracks that a request was made and its outcome).
  returnRequest: {
    requested: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    requestedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
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
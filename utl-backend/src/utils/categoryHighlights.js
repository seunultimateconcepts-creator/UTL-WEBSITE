/* eslint-disable no-undef */
const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')
const { getNextSequence } = require('../models/counter')
const { getZoneInfo, DELIVERY_ZONES } = require('../config/deliveryZones')
const sendEmail = require('../utils/sendEmail')
const { sellerNewOrderEmail, orderStatusUpdateEmail } = require('../utils/emailTemplates')
const { createNotification } = require('../utils/notify')
const jwt = require('jsonwebtoken')

// ✅ Generates UTL-2026-00001 style order numbers. Year comes from the
// order's creation time, sequence is atomic (see Counter.js).
const generateOrderNumber = async () => {
  const year = new Date().getFullYear()
  const seq = await getNextSequence('order')
  return `UTL-${year}-${String(seq).padStart(5, '0')}`
}

// ✅ CREATE ORDER — the ONE place an order is actually recorded.
// This is what a cart checkout should call BEFORE opening the
// WhatsApp confirmation message, not after — the order should exist
// in the database regardless of whether the buyer actually sends the
// WhatsApp message.
const createOrder = async (req, res) => {
  try {
    const buyerId = req.user.id
    const { vendorId, items, notes, deliveryAddress, bookingDetails } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required' })
    }
    for (const item of items) {
      if (!item.name || !item.price) {
        return res.status(400).json({ success: false, message: 'Each item needs a name and price' })
      }
    }

    // ✅ Block self-purchase — checked against the actual Product's
    // vendorId in the database, not the client-supplied vendorId in
    // req.body (which could be spoofed). This is what stops a vendor
    // from ordering their own listing to fake a sale and free up a
    // tier slot without a real transaction happening.
    for (const item of items) {
      if (item.productId) {
        const ownedProduct = await Product.findOne({ _id: item.productId, vendorId: buyerId })
        if (ownedProduct) {
          return res.status(400).json({ success: false, message: "You can't order your own product" })
        }
      }
    }

    // ✅ Exactly one of deliveryAddress (physical goods) or
    // bookingDetails (hotel stay / property viewing / event date /
    // travel booking) is required — never both, never neither. Which
    // one the frontend sends is decided by the product's category
    // (see BOOKING_CATEGORIES in listingCategoryFields.js on the
    // frontend); the backend just enforces one is genuinely present.
    const hasBookingDetails = bookingDetails?.startDate
    const hasDeliveryAddress = deliveryAddress?.fullName && deliveryAddress?.phone && deliveryAddress?.coverageZone && deliveryAddress?.address

    if (!hasBookingDetails && !hasDeliveryAddress) {
      return res.status(400).json({ success: false, message: 'A complete delivery address or booking date is required' })
    }

    // ✅ DOUBLE-BOOKING PREVENTION — checked here, authoritatively,
    // never trusting the frontend's own disabled-dates display (that's
    // just a UX convenience, easy to bypass by editing the request).
    // A range counts as "taken" for any order on the SAME product that
    // isn't cancelled — deliberately not scoped to paymentStatus, so a
    // still-unpaid-but-pending booking already blocks the slot (same
    // reserve-on-order-not-on-payment principle as stock decrementing
    // for physical goods below). endDate falls back to startDate for
    // single-day categories (Property viewing, Event date, Travel).
    if (hasBookingDetails) {
      const requestedStart = new Date(bookingDetails.startDate)
      const requestedEnd = bookingDetails.endDate ? new Date(bookingDetails.endDate) : requestedStart
      const productId = items[0]?.productId

      if (productId) {
        const conflicting = await Order.findOne({
          'items.productId': productId,
          status: { $ne: 'cancelled' },
          'bookingDetails.startDate': { $lte: requestedEnd },
          $or: [
            { 'bookingDetails.endDate': { $gte: requestedStart } },
            { 'bookingDetails.endDate': null, 'bookingDetails.startDate': { $gte: requestedStart } },
          ],
        })
        if (conflicting) {
          return res.status(409).json({ success: false, message: 'Those dates are no longer available. Please choose different dates.' })
        }
      }
    }

    let zone = null
    let deliveryFee = 0
    let estimatedDeliveryDays = ''

    if (hasDeliveryAddress) {
      zone = getZoneInfo(deliveryAddress.coverageZone)
      if (!zone) {
        return res.status(400).json({ success: false, message: 'Invalid delivery zone selected' })
      }
      deliveryFee = zone.fee
      estimatedDeliveryDays = zone.estimatedDays
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    const grandTotal = totalAmount + deliveryFee

    const orderNumber = await generateOrderNumber()

    const order = await Order.create({
      orderNumber,
      buyerId,
      vendorId: vendorId || null,
      items,
      totalAmount,
      deliveryAddress: hasDeliveryAddress ? deliveryAddress : undefined,
      bookingDetails: hasBookingDetails ? bookingDetails : undefined,
      deliveryFee,
      estimatedDeliveryDays,
      grandTotal,
      notes: notes || '',
    })

    // ✅ Decrement stock for real vendor products (Ultimate Concepts'
    // sourcing-request items won't have a productId, so this only ever
    // touches actual Product documents). This is what makes a sold-out
    // product automatically stop counting against the vendor's tier
    // limit — see countActiveSlots in productController.js. Non-blocking
    // per item: a stock-update failure shouldn't undo an already-placed
    // order, same principle as the email sends below.
    for (const item of items) {
      if (item.productId) {
        try {
          const product = await Product.findById(item.productId)
          if (product) {
            product.stock = Math.max(0, product.stock - (item.quantity || 1))
            if (product.stock === 0) product.status = 'out_of_stock'
            await product.save()
          }
        } catch (stockError) {
          console.error('Stock update failed for product', item.productId, stockError.message)
        }
      }
    }

    // ✅ Placing a real order is the actual dashboardUnlocked trigger —
    // not a side-channel call the frontend has to remember to make
    // separately. Also remembers this address for next time — pure
    // convenience, never blocks order creation if something's odd.
    const buyer = await User.findById(buyerId)
    if (buyer) {
      buyer.dashboardUnlocked = true
      buyer.lastDeliveryAddress = deliveryAddress
      await buyer.save()
    }

    // ✅ Notify the vendor a real order needs fulfillment. Ultimate
    // Shop orders (vendorId: null) skip this — that's your own
    // catalog, and you already see every order in the Admin Orders tab.
    // Non-blocking: a failed notification email should never undo an
    // already-successful order, same pattern as every other email here.
    if (order.vendorId) {
      try {
        const vendor = await User.findById(order.vendorId)
        if (vendor?.email) {
          await sendEmail({
            to: vendor.email,
            subject: `New Order: ${order.orderNumber}`,
            html: sellerNewOrderEmail(vendor.firstName, order),
          })
        }
      } catch (emailError) {
        console.error('Vendor order notification failed (order still placed):', emailError.message)
      }
      try {
        await createNotification({
          userId: order.vendorId,
          type: 'order',
          title: 'New order received',
          message: `You've received a new order — ${order.orderNumber}.`,
          link: '/dashboard?tab=orders',
        })
      } catch (notifyError) {
        console.error('Vendor in-app notification failed (order still placed):', notifyError.message)
      }
    }

    res.status(201).json({
      success: true,
      order,
      dashboardUnlocked: true,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating order', error: error.message })
  }
}

// ✅ MY ORDERS — powers the buyer's dashboard Orders tab
const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.user.id
    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message })
  }
}

// ✅ VENDOR ORDERS — powers the seller dashboard Orders tab
// (Ultimate Shop orders, vendorId: null, never show up here — those are
// UTL's own, handled through WhatsApp/internal process directly)
const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.id
    const orders = await Order.find({ vendorId })
      .populate('buyerId', 'firstName lastName phone')
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message })
  }
}

// ✅ ADMIN — list all orders (same x-admin-key pattern as products/sellers)
const listAllOrders = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const orders = await Order.find()
      .populate('buyerId', 'firstName lastName email')
      .populate('vendorId', 'firstName lastName')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message })
  }
}

// ✅ DELIVERY ZONES — public, powers the checkout dropdown.
// Frontend never invents fees; it only ever displays what this returns.
const getDeliveryZones = async (req, res) => {
  res.status(200).json({ success: true, zones: DELIVERY_ZONES })
}

// ✅ LAST ADDRESS — prefills the checkout form so a returning customer
// doesn't retype everything. Empty object if they've never ordered.
const getLastAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('lastDeliveryAddress phone')
    res.status(200).json({
      success: true,
      address: user?.lastDeliveryAddress || null,
      phone: user?.phone || '',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching address', error: error.message })
  }
}

// ✅ NIGERIA_STATES_LGAS — powers the cascading State → LGA dropdown.
// Sent once, whole thing — 774 LGAs is small enough as JSON that
// splitting this into a per-state lookup call isn't worth the extra
// round trips.
const getNigeriaLGAs = async (req, res) => {
  const { NIGERIA_STATES_LGAS } = require('../config/nigeriaStatesLGAs')
  res.status(200).json({ success: true, statesLGAs: NIGERIA_STATES_LGAS })
}

// ✅ ADMIN — update order status (same x-admin-key gate, same shape as
// updateBookingStatus in bookingController.js). This didn't exist
// before — Orders were admin-viewable but not admin-manageable, so
// status could never move past 'pending' anywhere in the system.
const updateOrderStatus = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { orderId } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.status = status
    await order.save()

    try {
      const buyer = await User.findById(order.buyerId)
      if (buyer?.email) {
        await sendEmail({
          to: buyer.email,
          subject: `Order Update: ${order.orderNumber}`,
          html: orderStatusUpdateEmail(buyer.firstName, order),
        })
      }
    } catch (emailError) {
      console.error('Order status email failed (status still updated):', emailError.message)
    }

    try {
      await createNotification({
        userId: order.buyerId,
        type: 'order',
        title: 'Order update',
        message: `Your order ${order.orderNumber} is now ${status}.`,
        link: '/dashboard?tab=orders',
      })
    } catch (notifyError) {
      console.error('Order status notification failed (status still updated):', notifyError.message)
    }

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating order status', error: error.message })
  }
}

// ✅ CONFIRM PAYMENT — the vendor (or admin, for Ultimate Shop orders
// where vendorId is null) confirms they've received the buyer's bank
// transfer. Deliberately NOT behind the standard `protect` middleware,
// because this one route needs to accept EITHER a vendor's JWT (and
// then verify they own this specific order) OR the admin key — two
// different auth shapes the middleware doesn't support together, so
// the check is done by hand here instead.
const confirmOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    const adminKey = req.headers['x-admin-key']
    const isAdmin = adminKey && adminKey === process.env.ADMIN_SECRET

    let isOwningVendor = false
    if (!isAdmin) {
      const authHeader = req.headers.authorization
      if (authHeader?.startsWith('Bearer')) {
        try {
          const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
          isOwningVendor = order.vendorId && String(order.vendorId) === String(decoded.id)
        } catch {
          // invalid/expired token — falls through to the 403 below
        }
      }
    }

    if (!isAdmin && !isOwningVendor) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    if (order.paymentStatus === 'confirmed') {
      return res.status(400).json({ success: false, message: 'Payment already confirmed for this order' })
    }

    order.paymentStatus = 'confirmed'
    order.paymentConfirmedAt = new Date()
    // ✅ Payment confirmation is also the moment a pending order
    // becomes real — advances status alongside it so the vendor
    // doesn't have to separately remember to also move the status
    // dropdown. Only advances FROM 'pending' — if it was already
    // manually moved further (e.g. straight to 'processing'), this
    // won't step it backward.
    if (order.status === 'pending') order.status = 'confirmed'
    await order.save()

    try {
      await createNotification({
        userId: order.buyerId,
        type: 'order',
        title: 'Payment confirmed',
        message: `Your payment for order ${order.orderNumber} has been confirmed.`,
        link: '/dashboard?tab=orders',
      })
    } catch (notifyError) {
      console.error('Payment confirmation notification failed (payment still confirmed):', notifyError.message)
    }

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error confirming payment', error: error.message })
  }
}

// ✅ GET BOOKED DATES — public (no auth needed to view availability,
// same as browsing the product itself). Returns the date ranges
// already taken for this product so BookingDateForm.jsx can show them
// and validate client-side. This is a UX convenience ONLY — the real
// enforcement is the overlap check inside createOrder above; this
// endpoint being wrong or bypassed can't create a double-booking.
const getBookedDates = async (req, res) => {
  try {
    const { productId } = req.params
    const orders = await Order.find({
      'items.productId': productId,
      status: { $ne: 'cancelled' },
      'bookingDetails.startDate': { $ne: null },
    }).select('bookingDetails')

    const bookedDates = orders.map(o => ({
      startDate: o.bookingDetails.startDate,
      endDate: o.bookingDetails.endDate || o.bookingDetails.startDate,
    }))

    res.status(200).json({ success: true, bookedDates })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching booked dates', error: error.message })
  }
}

// ✅ GET ORDER BY ID — powers the receipt page. Same dual-auth shape
// as confirmOrderPayment (vendor JWT OR admin key) PLUS the buyer
// themselves, since a receipt is something the buyer needs to view
// too, not just confirm.
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
      .populate('buyerId', 'firstName lastName email phone')
      .populate('vendorId', 'firstName lastName vendorProfile.shopName')
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    const adminKey = req.headers['x-admin-key']
    const isAdmin = adminKey && adminKey === process.env.ADMIN_SECRET

    let isOwner = false
    if (!isAdmin) {
      const authHeader = req.headers.authorization
      if (authHeader?.startsWith('Bearer')) {
        try {
          const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
          isOwner = String(order.buyerId._id) === String(decoded.id) || (order.vendorId && String(order.vendorId._id) === String(decoded.id))
        } catch {
          // invalid/expired token — falls through to the 403 below
        }
      }
    }

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching order', error: error.message })
  }
}

module.exports = { createOrder, getMyOrders, getVendorOrders, listAllOrders, updateOrderStatus, confirmOrderPayment, getBookedDates, getOrderById, getDeliveryZones, getLastAddress, getNigeriaLGAs }
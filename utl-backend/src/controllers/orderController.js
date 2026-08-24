/* eslint-disable no-undef */
const Order = require('../models/order')
const User = require('../models/user')
const { getNextSequence } = require('../models/counter')
const { getZoneInfo, DELIVERY_ZONES } = require('../config/deliveryZones')
const sendEmail = require('../utils/sendEmail')
const { sellerNewOrderEmail } = require('../utils/emailTemplates')

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
    const { vendorId, items, notes, deliveryAddress } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required' })
    }
    for (const item of items) {
      if (!item.name || !item.price) {
        return res.status(400).json({ success: false, message: 'Each item needs a name and price' })
      }
    }

    if (!deliveryAddress?.fullName || !deliveryAddress?.phone || !deliveryAddress?.coverageZone || !deliveryAddress?.address) {
      return res.status(400).json({ success: false, message: 'A complete delivery address is required' })
    }

    const zone = getZoneInfo(deliveryAddress.coverageZone)
    if (!zone) {
      return res.status(400).json({ success: false, message: 'Invalid delivery zone selected' })
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    const deliveryFee = zone.fee
    const grandTotal = totalAmount + deliveryFee

    const orderNumber = await generateOrderNumber()

    const order = await Order.create({
      orderNumber,
      buyerId,
      vendorId: vendorId || null,
      items,
      totalAmount,
      deliveryAddress,
      deliveryFee,
      estimatedDeliveryDays: zone.estimatedDays,
      grandTotal,
      notes: notes || '',
    })

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

module.exports = { createOrder, getMyOrders, getVendorOrders, listAllOrders, getDeliveryZones, getLastAddress }
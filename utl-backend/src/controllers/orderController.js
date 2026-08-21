/* eslint-disable no-undef */
const Order = require('../models/order')
const User = require('../models/user')
const { getNextSequence } = require('../models/counter')

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
    const { vendorId, items, notes } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required' })
    }
    for (const item of items) {
      if (!item.name || !item.price) {
        return res.status(400).json({ success: false, message: 'Each item needs a name and price' })
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)

    const orderNumber = await generateOrderNumber()

    const order = await Order.create({
      orderNumber,
      buyerId,
      vendorId: vendorId || null,
      items,
      totalAmount,
      notes: notes || '',
    })

    // ✅ Placing a real order is the actual dashboardUnlocked trigger —
    // not a side-channel call the frontend has to remember to make
    // separately. No-op if the user already has it.
    const buyer = await User.findById(buyerId)
    if (buyer && !buyer.dashboardUnlocked) {
      buyer.dashboardUnlocked = true
      await buyer.save()
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

module.exports = { createOrder, getMyOrders, getVendorOrders, listAllOrders }
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
// This is what UTLShopStore.jsx and ProductDetail.jsx's "Place Order"
// buttons should call BEFORE opening the WhatsApp confirmation message,
// not after — the order should exist in the database regardless of
// whether the buyer actually sends the WhatsApp message.
const createOrder = async (req, res) => {
  try {
    const buyerId = req.user.id
    const { productId, vendorId, productSnapshot, quantity, notes } = req.body

    if (!productSnapshot?.name || !productSnapshot?.price) {
      return res.status(400).json({ success: false, message: 'Product details are required' })
    }

    const orderNumber = await generateOrderNumber()

    const order = await Order.create({
      orderNumber,
      buyerId,
      vendorId: vendorId || null,
      productId: productId || null,
      productSnapshot,
      quantity: quantity || 1,
      notes: notes || '',
    })

    // ✅ THIS replaces the interim unlock-dashboard call. Placing a real
    // order is the actual trigger — not a side-channel call the frontend
    // has to remember to make separately. If the user already has
    // dashboardUnlocked, this is a no-op.
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
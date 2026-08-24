/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { createOrder, getMyOrders, getVendorOrders, listAllOrders, getDeliveryZones, getLastAddress } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Static paths before dynamic ones — same ordering rule as
// productRoutes.js and inquiryRoutes.js (none of these are dynamic
// :id routes right now, but keep the habit for when they are)
router.get('/delivery-zones', getDeliveryZones)        // GET /api/orders/delivery-zones (public)
router.get('/last-address', protect, getLastAddress)   // GET /api/orders/last-address (buyer)
router.get('/all', listAllOrders)              // GET /api/orders/all (admin key)
router.get('/my-orders', protect, getMyOrders)         // GET /api/orders/my-orders (buyer)
router.get('/vendor-orders', protect, getVendorOrders) // GET /api/orders/vendor-orders (seller)
router.post('/', protect, createOrder)                 // POST /api/orders

module.exports = router
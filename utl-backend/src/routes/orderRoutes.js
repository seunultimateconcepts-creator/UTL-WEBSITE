/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { createOrder, getMyOrders, getVendorOrders, listAllOrders, updateOrderStatus, confirmOrderPayment, getBookedDates, getOrderById, confirmDelivery, requestReturn, resolveReturn, getDeliveryZones, getLastAddress, getNigeriaLGAs } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')
const blockSellerCustomerActions = require('../middleware/blockSellerCustomerActions')

// ✅ Static paths before dynamic ones — same ordering rule as
// productRoutes.js and inquiryRoutes.js (none of these are dynamic
// :id routes right now, but keep the habit for when they are)
router.get('/delivery-zones', getDeliveryZones)        // GET /api/orders/delivery-zones (public)
router.get('/nigeria-lgas', getNigeriaLGAs)             // GET /api/orders/nigeria-lgas (public)
router.get('/last-address', protect, getLastAddress)   // GET /api/orders/last-address (buyer)
router.get('/all', listAllOrders)              // GET /api/orders/all (admin key)
router.get('/my-orders', protect, getMyOrders)         // GET /api/orders/my-orders (buyer)
router.get('/vendor-orders', protect, getVendorOrders) // GET /api/orders/vendor-orders (seller)
router.get('/booked-dates/:productId', getBookedDates) // GET /api/orders/booked-dates/:productId (public)
router.post('/', protect, blockSellerCustomerActions, createOrder) // POST /api/orders
router.patch('/:orderId/status', updateOrderStatus)    // PATCH /api/orders/:orderId/status (vendor JWT or admin key — checked inside the controller)
router.patch('/:orderId/confirm-payment', confirmOrderPayment) // PATCH /api/orders/:orderId/confirm-payment (vendor JWT or admin key — checked inside the controller)
router.patch('/:orderId/confirm-delivery', protect, confirmDelivery) // PATCH /api/orders/:orderId/confirm-delivery (buyer only)
router.post('/:orderId/return', protect, requestReturn)        // POST /api/orders/:orderId/return (buyer only)
router.patch('/:orderId/return/resolve', resolveReturn)        // PATCH /api/orders/:orderId/return/resolve (vendor JWT or admin key — checked inside the controller)
router.get('/:orderId', getOrderById)                  // GET /api/orders/:orderId (buyer, owning vendor, or admin key — checked inside the controller) — powers the receipt page

module.exports = router
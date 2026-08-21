/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const inquiryController = require('../controllers/inquiryController')
const { protect } = require('../middleware/authMiddleware')

// ✅ Public — anyone can browse products, no login required
router.get('/', productController.listByVendor)      // GET /api/products?vendorId=xxx
router.get('/all', productController.listAll)         // GET /api/products/all (admin key, not auth)
router.get('/:productId', productController.getById)  // GET /api/products/:productId

// ✅ Authenticated — must be logged in
router.post('/', protect, productController.create) // POST /api/products (approved sellers only, checked inside controller)
router.post('/:productId/ask', protect, inquiryController.ask) // POST /api/products/:productId/ask

// ✅ Admin key — not user auth, checked inside the controller via x-admin-key header
router.delete('/:productId', productController.deleteProduct) // DELETE /api/products/:productId

module.exports = router
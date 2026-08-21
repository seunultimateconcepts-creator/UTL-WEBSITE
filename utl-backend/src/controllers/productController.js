/* eslint-disable no-undef */
const Product = require('../models/Product')
const User = require('../models/user')

// ✅ LIST PRODUCTS FOR A VENDOR — powers the vendor store page
// GET /api/products?vendorId=xxx
const listByVendor = async (req, res) => {
  try {
    const { vendorId } = req.query
    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'vendorId is required' })
    }

    const products = await Product.find({ vendorId, status: 'active' })
      .populate('vendorId', 'firstName lastName')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message })
  }
}

// ✅ GET SINGLE PRODUCT — powers the product detail page + ProductChat grounding
// GET /api/products/:productId
const getById = async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const vendor = await User.findById(product.vendorId).select('firstName lastName')

    res.status(200).json({
      success: true,
      product,
      vendor: vendor ? { firstName: vendor.firstName, lastName: vendor.lastName } : null,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching product', error: error.message })
  }
}

// ✅ CREATE PRODUCT — only approved sellers can list products.
// TODO: this is the minimum to unblock the listing/detail pages. Still
// needed: image upload handling (currently expects image URLs directly),
// an edit endpoint, and a delete/archive endpoint for the seller dashboard.
const create = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id)
    if (!vendor || vendor.sellerStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Only approved sellers can list products' })
    }

    const { name, description, price, category, stock, images, faqs, policies } = req.body

    const product = await Product.create({
      vendorId: req.user.id,
      name,
      description,
      price,
      category,
      stock,
      images,
      faqs,
      policies,
    })

    res.status(201).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating product', error: error.message })
  }
}

// ✅ LIST ALL PRODUCTS — admin only, powers the "delete test data" panel
// GET /api/products/all
const listAll = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const products = await Product.find()
      .populate('vendorId', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message })
  }
}

// ✅ DELETE PRODUCT — admin only. This is the "get rid of a test live
// page" button — deleting a vendor's only product effectively empties
// their storefront back to the "no products yet" state.
// DELETE /api/products/:productId
const deleteProduct = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { productId } = req.params
    const product = await Product.findByIdAndDelete(productId)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting product', error: error.message })
  }
}

module.exports = { listByVendor, getById, create, listAll, deleteProduct }
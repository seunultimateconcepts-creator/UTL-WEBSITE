/* eslint-disable no-undef */
const Product = require('../models/product')
const User = require('../models/user')
const { SUBSCRIPTION_TIERS, DELETE_COOLDOWN_DAYS } = require('../config/subscriptionTiers')

// ✅ Counts what actually consumes a tier slot right now — NOT lifetime
// uploads. A product that sold out (stock hit 0, never manually
// deleted) is EXCLUDED — that's legitimate turnover, frees the slot
// immediately. A manually deleted product stays counted for
// DELETE_COOLDOWN_DAYS specifically to stop delete-and-relist from
// being a way to dodge the cap.
const countActiveSlots = async (vendorId) => {
  const cooldownCutoff = new Date(Date.now() - DELETE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000)
  return Product.countDocuments({
    vendorId,
    $or: [
      { deletedAt: null, stock: { $gt: 0 } },        // active, in stock, never deleted
      { deletedAt: { $gte: cooldownCutoff } },        // deleted but still within cooldown
    ],
  })
}

// ✅ LIST PRODUCTS FOR A VENDOR — powers the vendor store page
// GET /api/products?vendorId=xxx
const listByVendor = async (req, res) => {
  try {
    const { vendorId } = req.query
    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'vendorId is required' })
    }

    const products = await Product.find({ vendorId, status: 'active', deletedAt: null })
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
    const product = await Product.findOne({ _id: productId, deletedAt: null })

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

// ✅ CREATE PRODUCT — approved sellers only, and only if their tier
// has room. This is the actual enforcement point — everything else
// (frontend messaging, upgrade prompts) is just UX on top of this.
const create = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id)
    if (!vendor || vendor.sellerStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Only approved sellers can list products' })
    }

    const tier = vendor.subscription?.tier || 'free'
    const tierConfig = SUBSCRIPTION_TIERS[tier]
    const currentSlots = await countActiveSlots(req.user.id)

    if (currentSlots >= tierConfig.maxListings) {
      return res.status(403).json({
        success: false,
        message: `You've reached your ${tierConfig.label} plan limit of ${tierConfig.maxListings} listings. Upgrade to list more.`,
      })
    }

    const { name, description, price, category, stock, images, faqs, policies, videoUrl } = req.body

    // ✅ Video is Platinum-only — silently dropped for anyone else,
    // not an error, since a downgraded vendor's old form data shouldn't
    // hard-fail a save over a field they can no longer use.
    const finalVideoUrl = tierConfig.videoAllowed ? (videoUrl || '') : ''

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
      videoUrl: finalVideoUrl,
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

// ✅ GET MY PRODUCTS — powers the seller's "My Shop" management view.
// Unlike listByVendor (public storefront, active only), this returns
// EVERY status including drafts/out-of-stock, since the seller needs
// to see and manage all of it, not just what customers see.
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id, deletedAt: null }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching your products', error: error.message })
  }
}

// ✅ UPDATE MY PRODUCT — the real ownership check happens HERE
// server-side (vendorId must match req.user.id), not just in the
// frontend UI. Anyone could hit this endpoint directly with someone
// else's productId; this is what actually stops them.
const updateMyProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findOne({ _id: productId, deletedAt: null })

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own products' })
    }

    const { name, description, price, category, stock, images, faqs, policies, status, videoUrl } = req.body

    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (category !== undefined) product.category = category
    if (stock !== undefined) product.stock = stock
    if (images !== undefined) product.images = images
    if (faqs !== undefined) product.faqs = faqs
    if (policies !== undefined) product.policies = policies
    if (status !== undefined) product.status = status

    // ✅ Same tier check as creation — re-verified here in case the
    // vendor's tier changed (e.g. downgraded) since the product was made
    if (videoUrl !== undefined) {
      const vendor = await User.findById(req.user.id)
      const tier = vendor?.subscription?.tier || 'free'
      product.videoUrl = SUBSCRIPTION_TIERS[tier].videoAllowed ? videoUrl : ''
    }

    await product.save()

    res.status(200).json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating product', error: error.message })
  }
}

// ✅ DELETE MY PRODUCT — same ownership check, seller's own auth
// token instead of the admin key. Deliberately a DIFFERENT route
// (/my-products/:id) from the admin delete (/:id) so the two never
// collide or get confused with each other.
const deleteMyProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findOne({ _id: productId, deletedAt: null })

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own products' })
    }

    // ✅ Soft delete, not a real deletion — see Product.js and
    // countActiveSlots above. This is what makes the delete-and-relist
    // cooldown possible: the product disappears from every customer-
    // and vendor-facing query immediately, but keeps counting against
    // the tier limit for DELETE_COOLDOWN_DAYS.
    product.deletedAt = new Date()
    await product.save()

    res.status(200).json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting product', error: error.message })
  }
}

module.exports = { listByVendor, getById, create, listAll, deleteProduct, getMyProducts, updateMyProduct, deleteMyProduct }
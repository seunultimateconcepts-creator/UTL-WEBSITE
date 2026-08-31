/* eslint-disable no-undef */
const SourcingRequest = require('../models/sourcingRequest')
const User = require('../models/user')
const { getNextSequence } = require('../models/counter')
const sendEmail = require('../utils/sendEmail')
const { sourcingRequestReceivedEmail, sourcingRequestStatusEmail } = require('../utils/emailTemplates')

// ✅ SR-2026-00001 style — same atomic Counter as Order/Booking, own key
const generateRequestNumber = async () => {
  const year = new Date().getFullYear()
  const seq = await getNextSequence('sourcingRequest')
  return `SR-${year}-${String(seq).padStart(5, '0')}`
}

// ✅ CREATE REQUEST
const createRequest = async (req, res) => {
  try {
    const customerId = req.user.id
    const { items, contactPhone, notes } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required' })
    }
    if (!contactPhone) {
      return res.status(400).json({ success: false, message: 'Contact phone is required' })
    }
    for (const item of items) {
      if (!item.platform || !item.description) {
        return res.status(400).json({ success: false, message: 'Each item needs a platform and description' })
      }
    }

    const requestNumber = await generateRequestNumber()

    const request = await SourcingRequest.create({
      requestNumber,
      customerId,
      items,
      contactPhone,
      notes: notes || '',
    })

    // ✅ Same dashboardUnlocked principle as Order/Booking — a real
    // sourcing request is real engagement.
    const customer = await User.findById(customerId)
    if (customer && !customer.dashboardUnlocked) {
      customer.dashboardUnlocked = true
      await customer.save()
    }

    try {
      if (customer?.email) {
        await sendEmail({
          to: customer.email,
          subject: `Request Received: ${request.requestNumber}`,
          html: sourcingRequestReceivedEmail(customer.firstName, request),
        })
      }
    } catch (emailError) {
      console.error('Sourcing request confirmation email failed (request still created):', emailError.message)
    }

    res.status(201).json({ success: true, request })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating request', error: error.message })
  }
}

// ✅ MY REQUESTS
const getMyRequests = async (req, res) => {
  try {
    const requests = await SourcingRequest.find({ customerId: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, requests })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching requests', error: error.message })
  }
}

// ✅ ADMIN — list all
const listAllRequests = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const requests = await SourcingRequest.find()
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, requests })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching requests', error: error.message })
  }
}

// ✅ ADMIN — update a single item's sourcing proof (screenshot, external
// order number, actual price) once it's actually been purchased
const updateItemProof = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { requestId, itemIndex } = req.params
    const { screenshotUrl, externalOrderNumber, actualPrice } = req.body

    const request = await SourcingRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }
    if (!request.items[itemIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid item index' })
    }

    request.items[itemIndex].sourcingProof = {
      screenshotUrl: screenshotUrl || request.items[itemIndex].sourcingProof.screenshotUrl,
      externalOrderNumber: externalOrderNumber || request.items[itemIndex].sourcingProof.externalOrderNumber,
      actualPrice: actualPrice != null ? actualPrice : request.items[itemIndex].sourcingProof.actualPrice,
    }
    request.markModified('items')
    await request.save()

    res.status(200).json({ success: true, request })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating proof', error: error.message })
  }
}

// ✅ ADMIN — update status + fulfillment, fires the status email
const updateRequestStatus = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { requestId } = req.params
    const { status, fulfillmentMethod, fulfillmentDetails } = req.body

    const validStatuses = ['pending', 'sourcing', 'ready', 'completed', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const request = await SourcingRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }

    if (status) request.status = status
    if (fulfillmentMethod !== undefined) request.fulfillment.method = fulfillmentMethod
    if (fulfillmentDetails !== undefined) request.fulfillment.details = fulfillmentDetails

    await request.save()

    try {
      const customer = await User.findById(request.customerId)
      if (customer?.email) {
        await sendEmail({
          to: customer.email,
          subject: `Request Update: ${request.requestNumber}`,
          html: sourcingRequestStatusEmail(customer.firstName, request),
        })
      }
    } catch (emailError) {
      console.error('Sourcing request status email failed (status still updated):', emailError.message)
    }

    res.status(200).json({ success: true, request })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating request', error: error.message })
  }
}

module.exports = { createRequest, getMyRequests, listAllRequests, updateItemProof, updateRequestStatus }
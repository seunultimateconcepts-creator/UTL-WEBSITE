/* eslint-disable no-undef */
const Conversation = require('../models/conversation')
const Message = require('../models/message')
const Product = require('../models/product')
const SourcingRequest = require('../models/sourcingRequest')

// ══════════════════════════════════════════════════════════════
// BUYER/VENDOR SIDE — JWT-protected, req.user.id
// ══════════════════════════════════════════════════════════════

// ✅ GET OR CREATE CONVERSATION — accepts EITHER productId (product
// chat with a real vendor) OR sourcingRequestId (Ultimate Concepts
// chat with admin). Never both.
const getOrCreateConversation = async (req, res) => {
  try {
    const buyerId = req.user.id
    const { productId, sourcingRequestId } = req.body

    if (!productId && !sourcingRequestId) {
      return res.status(400).json({ success: false, message: 'productId or sourcingRequestId is required' })
    }

    if (productId) {
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' })
      }
      const vendorId = product.vendorId
      if (vendorId.toString() === buyerId) {
        return res.status(400).json({ success: false, message: "You can't message yourself about your own product" })
      }

      const conversation = await Conversation.findOneAndUpdate(
        { buyerId, vendorId, productId },
        { $setOnInsert: { buyerId, vendorId, productId } },
        { new: true, upsert: true }
      ).populate('buyerId vendorId', 'firstName lastName phone').populate('productId', 'name images')

      return res.status(200).json({ success: true, conversation })
    }

    // sourcingRequestId path — customer can only open a thread about
    // their OWN request
    const request = await SourcingRequest.findById(sourcingRequestId)
    if (!request) {
      return res.status(404).json({ success: false, message: 'Sourcing request not found' })
    }
    if (request.customerId.toString() !== buyerId) {
      return res.status(403).json({ success: false, message: 'Not your request' })
    }

    const conversation = await Conversation.findOneAndUpdate(
      { buyerId, sourcingRequestId },
      { $setOnInsert: { buyerId, sourcingRequestId } },
      { new: true, upsert: true }
    ).populate('buyerId', 'firstName lastName phone')

    res.status(200).json({ success: true, conversation })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error starting conversation', error: error.message })
  }
}

// ✅ MY CONVERSATIONS — both product and sourcing-request threads,
// for whichever role applies to the logged-in user
const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id
    const conversations = await Conversation.find({
      $or: [{ buyerId: userId }, { vendorId: userId }],
    })
      .populate('buyerId vendorId', 'firstName lastName phone')
      .populate('productId', 'name images')
      .sort({ lastMessageAt: -1 })

    res.status(200).json({ success: true, conversations })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching conversations', error: error.message })
  }
}

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const conversation = await Conversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' })
    }
    const isParticipant = conversation.buyerId.toString() === req.user.id ||
      (conversation.vendorId && conversation.vendorId.toString() === req.user.id)
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not your conversation' })
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 })
    res.status(200).json({ success: true, messages })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching messages', error: error.message })
  }
}

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' })
    }

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' })
    }

    let senderRole
    if (conversation.buyerId.toString() === req.user.id) senderRole = 'buyer'
    else if (conversation.vendorId && conversation.vendorId.toString() === req.user.id) senderRole = 'vendor'
    else return res.status(403).json({ success: false, message: 'Not your conversation' })

    const message = await Message.create({
      conversationId,
      senderRole,
      senderId: req.user.id,
      text: text.trim(),
    })

    conversation.lastMessageAt = new Date()
    conversation.lastMessagePreview = text.trim().slice(0, 100)
    await conversation.save()

    res.status(201).json({ success: true, message })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error sending message', error: error.message })
  }
}

// ══════════════════════════════════════════════════════════════
// ADMIN SIDE — x-admin-key protected, no req.user (admin has no
// User document at all, it's a shared-secret role not a login)
// ══════════════════════════════════════════════════════════════

// ✅ Find the conversation for a given sourcing request, if the buyer
// has started one. Returns null (not 404) if they haven't — that's a
// normal state, not an error, from admin's perspective.
const adminGetConversationForRequest = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { sourcingRequestId } = req.params
    const conversation = await Conversation.findOne({ sourcingRequestId })
      .populate('buyerId', 'firstName lastName phone')

    res.status(200).json({ success: true, conversation: conversation || null })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching conversation', error: error.message })
  }
}

const adminGetMessages = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { conversationId } = req.params
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 })
    res.status(200).json({ success: true, messages })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching messages', error: error.message })
  }
}

const adminSendMessage = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const { conversationId } = req.params
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' })
    }

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' })
    }

    const message = await Message.create({
      conversationId,
      senderRole: 'admin',
      senderId: null,
      text: text.trim(),
    })

    conversation.lastMessageAt = new Date()
    conversation.lastMessagePreview = text.trim().slice(0, 100)
    await conversation.save()

    res.status(201).json({ success: true, message })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error sending message', error: error.message })
  }
}

module.exports = {
  getOrCreateConversation, getMyConversations, getMessages, sendMessage,
  adminGetConversationForRequest, adminGetMessages, adminSendMessage,
}
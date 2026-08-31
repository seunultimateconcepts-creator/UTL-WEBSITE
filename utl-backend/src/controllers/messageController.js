/* eslint-disable no-undef */
const Conversation = require('../models/conversation')
const Message = require('../models/message')
const Product = require('../models/product')

// ✅ GET OR CREATE CONVERSATION — called when a buyer clicks "Message
// Seller" on a product. Upsert avoids a race where two rapid clicks
// create two conversations for the same buyer/vendor/product combo.
const getOrCreateConversation = async (req, res) => {
  try {
    const buyerId = req.user.id
    const { productId } = req.body

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

    res.status(200).json({ success: true, conversation })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error starting conversation', error: error.message })
  }
}

// ✅ MY CONVERSATIONS — works for both sides. A buyer sees threads
// where they're the buyer; an approved seller sees threads where
// they're the vendor. Same endpoint, filtered by whichever role
// applies to the logged-in user.
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

// ✅ GET MESSAGES — the polling endpoint. Returns the full thread;
// fine at this scale, worth revisiting (pagination, since-timestamp)
// only if a thread genuinely grows very long.
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const conversation = await Conversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' })
    }
    const isParticipant = [conversation.buyerId.toString(), conversation.vendorId.toString()].includes(req.user.id)
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not your conversation' })
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 })
    res.status(200).json({ success: true, messages })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching messages', error: error.message })
  }
}

// ✅ SEND MESSAGE
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
    const isParticipant = [conversation.buyerId.toString(), conversation.vendorId.toString()].includes(req.user.id)
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not your conversation' })
    }

    const message = await Message.create({
      conversationId,
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

module.exports = { getOrCreateConversation, getMyConversations, getMessages, sendMessage }
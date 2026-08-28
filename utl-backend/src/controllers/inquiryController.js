/* eslint-disable no-undef */
const Inquiry = require('../models/inquiry')
const Product = require('../models/product')
const User = require('../models/user')
const { filterMessage } = require('../utils/contactFilter')

// ✅ Anthropic API call — grounds the answer in THIS product's data only.
// Model: claude-sonnet-5. Right balance of cost/quality for this — Opus
// is overkill for grounded product Q&A, Haiku risks being too easy to
// talk into leaking contact info via prompt tricks.
const askClaude = async (question, product, vendor, faqs) => {
  const faqText = faqs.length
    ? faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : 'No FAQs added yet for this product.'

  const systemPrompt = `You are a shopping assistant for U-Come, answering questions about ONE specific product listing on behalf of the vendor.

PRODUCT DATA (this is your only source of truth — do not invent details not listed here):
Name: ${product.name}
Description: ${product.description}
Price: ${product.currency} ${product.price}
Category: ${product.category}
Stock: ${product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
Delivery policy: ${product.policies?.delivery || 'Not specified'}
Returns policy: ${product.policies?.returns || 'Not specified'}
Vendor: ${vendor.firstName} ${vendor.lastName}

VENDOR-PROVIDED FAQs:
${faqText}

RULES:
- Answer only using the information above. If the question needs details not listed here (custom requests, negotiation, availability changes, anything you're not certain of), say so plainly and suggest the buyer request the vendor directly through the platform — do NOT guess or make up an answer.
- NEVER share, request, or suggest sharing any contact information (phone numbers, email, WhatsApp, social media). If asked for the vendor's contact info, explain that all communication happens through U-Come to keep both buyer and vendor protected, and that they can request the vendor directly if needed.
- Keep answers short and conversational — 2-4 sentences.
- If you cannot confidently answer, end your response with exactly this marker on its own line: [NEEDS_VENDOR]`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    }),
  })

  if (!response.ok) {
    const errBody = await response.text()
    throw new Error(`Anthropic API error: ${response.status} ${errBody}`)
  }

  const data = await response.json()
  const rawAnswer = data.content?.[0]?.text || "Sorry, I couldn't process that — please try again."

  const needsVendor = rawAnswer.includes('[NEEDS_VENDOR]')
  const answer = rawAnswer.replace('[NEEDS_VENDOR]', '').trim()

  return { answer, needsVendor }
}

// ✅ ASK — buyer asks the AI a question about a product.
// Creates the thread on first use, reuses it after (one thread per
// buyer+product pair, per the schema's unique index).
const ask = async (req, res) => {
  try {
    const { productId } = req.params
    const { question } = req.body
    const buyerId = req.user.id

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const vendor = await User.findById(product.vendorId)

    let inquiry = await Inquiry.findOne({ productId, buyerId })
    if (!inquiry) {
      inquiry = await Inquiry.create({
        productId,
        buyerId,
        vendorId: product.vendorId,
        messages: [],
      })
    }

    // Filter the buyer's own question too — belt-and-braces in case they
    // try to slip contact info to the AI on the assumption it'll relay it
    const { text: filteredQuestion, wasFiltered: buyerFiltered } = filterMessage(question)
    inquiry.messages.push({ sender: 'buyer', text: filteredQuestion, wasFiltered: buyerFiltered })

    const { answer, needsVendor } = await askClaude(filteredQuestion, product, vendor, product.faqs)
    inquiry.messages.push({ sender: 'ai', text: answer, wasFiltered: false })

    if (buyerFiltered) inquiry.flagCount += 1

    await inquiry.save()

    res.status(200).json({
      success: true,
      inquiry,
      needsVendor, // frontend uses this to show the "Ask the vendor instead" button
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error asking question', error: error.message })
  }
}

// ✅ ESCALATE — buyer decides the AI couldn't help, hands off to the vendor.
// Buyer-initiated by design (see earlier discussion) rather than relying
// on the AI to self-assess confidence, which is a fragile signal.
const escalate = async (req, res) => {
  try {
    const { inquiryId } = req.params
    const buyerId = req.user.id

    const inquiry = await Inquiry.findOne({ _id: inquiryId, buyerId })
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    inquiry.status = 'escalated'
    await inquiry.save()

    res.status(200).json({ success: true, message: 'Escalated to vendor', inquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error escalating inquiry', error: error.message })
  }
}

// ✅ VENDOR REPLY — the one human-to-human message path in this system.
// Filtered the same way, this is the tier that actually needs the
// contact-info backstop since a real person is on both ends now.
const vendorReply = async (req, res) => {
  try {
    const { inquiryId } = req.params
    const { text } = req.body
    const vendorId = req.user.id

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required' })
    }

    const inquiry = await Inquiry.findOne({ _id: inquiryId, vendorId })
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    const { text: filteredText, wasFiltered } = filterMessage(text)
    inquiry.messages.push({ sender: 'vendor', text: filteredText, wasFiltered })

    if (wasFiltered) {
      inquiry.flagCount += 1

      // ✅ Repeat-offender threshold. Doesn't auto-suspend — just flags
      // for the manual review process you already use for seller approval.
      // Wire actual notification/admin-alert logic here once you have it.
      if (inquiry.flagCount >= 3) {
        console.warn(`Vendor ${vendorId} has ${inquiry.flagCount} filtered messages in inquiry ${inquiryId} — flag for manual review`)
      }
    }

    await inquiry.save()

    res.status(200).json({ success: true, inquiry, wasFiltered })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error sending reply', error: error.message })
  }
}

// ✅ GET THREAD — either the buyer or the vendor on this inquiry can fetch it
const getThread = async (req, res) => {
  try {
    const { inquiryId } = req.params
    const userId = req.user.id

    const inquiry = await Inquiry.findOne({
      _id: inquiryId,
      $or: [{ buyerId: userId }, { vendorId: userId }],
    })

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }

    res.status(200).json({ success: true, inquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching inquiry', error: error.message })
  }
}

// ✅ GET MY INQUIRIES (VENDOR INBOX) — powers the "Messages" tab in the
// seller dashboard, replacing its current "No Messages Yet" placeholder
const getVendorInbox = async (req, res) => {
  try {
    const vendorId = req.user.id
    const inquiries = await Inquiry.find({ vendorId, status: 'escalated' })
      .populate('productId', 'name images')
      .populate('buyerId', 'firstName lastName')
      .sort({ updatedAt: -1 })

    res.status(200).json({ success: true, inquiries })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching inbox', error: error.message })
  }
}

// ✅ BUYER REPLY (post-escalation) — once a thread is escalated, buyer
// messages go straight to the vendor, not the AI. Same filter applied.
const buyerReply = async (req, res) => {
  try {
    const { inquiryId } = req.params
    const { text } = req.body
    const buyerId = req.user.id

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' })
    }

    const inquiry = await Inquiry.findOne({ _id: inquiryId, buyerId })
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' })
    }
    if (inquiry.status !== 'escalated') {
      return res.status(400).json({ success: false, message: 'This inquiry has not been escalated to the vendor yet' })
    }

    const { text: filteredText, wasFiltered } = filterMessage(text)
    inquiry.messages.push({ sender: 'buyer', text: filteredText, wasFiltered })
    if (wasFiltered) inquiry.flagCount += 1

    await inquiry.save()

    res.status(200).json({ success: true, inquiry, wasFiltered })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error sending message', error: error.message })
  }
}

module.exports = { ask, escalate, vendorReply, buyerReply, getThread, getVendorInbox }
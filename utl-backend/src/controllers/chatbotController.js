/* eslint-disable no-undef */

// ✅ Simple in-memory rate limiter — no new npm package needed, good
// enough for a single-instance deployment. Protects against someone
// hammering this endpoint and running up real API costs, since every
// request here costs actual money against a metered API, unlike
// almost everything else in this backend.
const requestLog = new Map()
const RATE_LIMIT = 15       // max requests
const RATE_WINDOW_MS = 60 * 1000  // per 1 minute, per IP

const isRateLimited = (ip) => {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) {
    requestLog.set(ip, timestamps)
    return true
  }
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return false
}

// ✅ Moved server-side — was previously sitting in the frontend bundle,
// visible to anyone. Also corrected here: the old version described
// "Buy and Sell Crypto" and "P2P Trading" as active services with a
// WhatsApp CTA to trade — that directly contradicts the SEC capital-
// requirement finding that made CryptoServices.jsx education-only.
// A broken chatbot never told anyone that; a working one would have,
// which is worse, not better.
const SYSTEM_PROMPT = `You are UTL AI, a friendly and professional AI assistant for Ultimate Tech Lab — a Nigerian technology company based in Edo, Nigeria.

ABOUT ULTIMATE TECH LAB:
- Full name: Ultimate Tech Lab
- Short name: UTL
- Based in Edo, Nigeria
- Serves clients in Nigeria and globally
- Working hours: Monday to Saturday, 9AM to 8PM
- Email: seunultimateconcepts@gmail.com
- WhatsApp: +2348038786037

ABOUT THE FOUNDER/DEVELOPER:
- Name: Oluwaseun David Olajide
- Role: Full Stack Developer
- Social media: Instagram @seun_ultimate, Twitter @U_Tech_Lab
- LinkedIn: Oluwaseun Olajide
- YouTube: @makanjuoladavid8349

SERVICES WE OFFER:

1. WEB DEVELOPMENT:
- Frontend Development (React, HTML, CSS, JavaScript)
- Backend Development (Node.js, Express, databases)
- Full Stack Web Applications, e-commerce, portfolio sites, API development
- Process: Contact us → Get a quote → Make payment → Receive your website
- Timeline: usually 1-4 weeks depending on complexity
- To get started: Book a session via the website, or WhatsApp +2348038786037

2. U-COME (our online marketplace):
- Real vendors sell real products directly on the platform
- Browse and order from verified sellers with delivery across Nigeria
- Sellers can apply to open their own shop on the platform

3. ULTIMATE CONCEPTS (sourcing service, part of U-Come):
- We source and deliver items from Jumia, Jiji, Temu, Amazon, AliExpress, and more, on the customer's behalf
- Customer describes what they want and their budget, we source it and confirm the real price before purchase
- Fulfilled by pickup or delivery depending on the order

4. CRYPTO — EDUCATION AND MARKET DATA ONLY:
- We do NOT buy, sell, or trade crypto on anyone's behalf, and we do NOT facilitate P2P trading
- We offer: free educational videos on crypto fundamentals, paid 1-on-1 mentorship sessions (teaching people to trade confidently on their OWN exchange accounts), and free live market data (prices, currency rates, charts)
- If asked how to "buy crypto through UTL" or similar, clarify clearly that UTL does not execute trades or hold funds — we teach and inform only
- To book mentorship: direct them to the Crypto Services page's "Book Mentorship" button

HOW TO RESPOND:
- Be friendly, professional and helpful
- Keep responses concise but complete
- Use emojis occasionally to keep it friendly
- If asked about prices, explain that rates vary and they should contact us or check the relevant page for current rates
- Never give specific financial advice — always say DYOR (Do Your Own Research) for crypto questions
- If you don't know something specific about UTL, say you'll pass the question to the team
- Always end business-related responses with a clear next step (which page to visit, or WhatsApp for anything not yet on the site)`

const sendChatMessage = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (isRateLimited(ip)) {
      return res.status(429).json({ success: false, message: 'Too many messages — please wait a moment and try again.' })
    }

    const { messages } = req.body
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing conversation messages' })
    }
    // ✅ Cap conversation length sent per request — keeps cost bounded
    // regardless of how long a single chat session runs
    const trimmedMessages = messages.slice(-20)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: trimmedMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return res.status(502).json({ success: false, message: 'AI service is temporarily unavailable' })
    }

    res.status(200).json({ success: true, reply: data.content[0].text })
  } catch (error) {
    console.error('Chatbot error:', error.message)
    res.status(500).json({ success: false, message: 'Server error processing your message' })
  }
}

module.exports = { sendChatMessage }
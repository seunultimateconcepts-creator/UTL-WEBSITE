import { useState, useEffect, useRef } from 'react'

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm **UTL AI**, your Ultimate Tech Lab assistant!\n\nI can help you with:\n- 🖥️ Web Development services\n- 💰 Crypto trading & P2P\n- 🛒 Shopping assistance\n- 📞 How to reach us\n- 💡 General tech & crypto questions\n\nWhat would you like to know?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // ✅ Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ Quick question suggestions
  const quickQuestions = [
    "What services do you offer?",
    "How do I buy crypto?",
    "What is P2P trading?",
    "How do I place a shopping order?",
    "How do I contact you?",
    "Who is the developer?",
  ]

  // ✅ This is the system prompt — it tells Claude everything about UTL
  // To update business info, just update this text
  const systemPrompt = `You are UTL AI, a friendly and professional AI assistant for Ultimate Tech Lab — a digital services company based in Lagos, Nigeria.

ABOUT ULTIMATE TECH LAB:
- Full name: Ultimate Tech Lab
- Short name: UTL
- Based in Edo, Nigeria
- Serves clients in Nigeria and globally
- Working hours: Monday to Saturday, 9AM to 8PM
- Email: seunultimateconcepts@gmail.com
- WhatsApp: +2348038786037

ABOUT THE FOUNDER/DEVELOPER:
- Name: Oluwaseun David Olajide (seunultimate)
- Role: Full Stack Developer & Crypto Trader
- Based in Lagos, Nigeria
- Social media: Instagram @seun_ultimate, Twitter @seun_ultimate
- LinkedIn: Oluwaseun Olajide
- YouTube: @makanjuoladavid8349
- Passionate about technology, crypto trading and helping people achieve their digital goals
- Currently building Ultimate Tech Lab as a one-stop digital solutions platform

SERVICES WE OFFER:

1. WEB DEVELOPMENT:
- Frontend Development (React, HTML, CSS, JavaScript)
- Backend Development (Node.js, Express, databases)
- Full Stack Web Applications
- Landing pages and business websites
- API Development and Integration
- E-commerce websites
- Portfolio websites
- Process: Contact us → Get a quote → Make payment → Receive your website
- Timeline: Depends on project complexity, usually 1-4 weeks
- To get started: Contact via WhatsApp +2348038786037

2. CRYPTO SERVICES:
- Buy and Sell Crypto (Bitcoin, Ethereum, USDT, BNB, Solana and more)
- P2P Trading — peer to peer trading at the best rates
- Best market rates guaranteed
- Mentorship for beginners who want to learn crypto trading
- We help you understand charts, trading strategies and risk management
- Supported coins: Bitcoin (BTC), Ethereum (ETH), USDT, BNB, Solana (SOL), Litecoin (LTC) and more
- To trade: Contact via WhatsApp +2348038786037
- P2P means you trade directly with a person instead of an exchange — safer and often better rates

3. SHOPPING ASSISTANCE:
- Order from Jumia, Temu, Amazon, AliExpress and any online store
- International shopping — we order from any store worldwide
- Doorstep delivery anywhere in Nigeria
- Package tracking provided
- Safe and fast delivery
- Process: Tell us what you want → We give you a quote including delivery → You pay → We order and deliver
- To place an order: Contact via WhatsApp +2348038786037

GENERAL CRYPTO KNOWLEDGE YOU CAN SHARE:
- Bitcoin (BTC): The first and largest cryptocurrency, created by Satoshi Nakamoto in 2009
- Ethereum (ETH): A blockchain platform that supports smart contracts and DeFi
- USDT: A stablecoin pegged to the US Dollar — good for storing value
- P2P Trading: Trading crypto directly with another person, often better rates than exchanges
- Bull market: When crypto prices are rising
- Bear market: When crypto prices are falling
- HODL: Holding crypto for long term instead of selling
- DeFi: Decentralized Finance — financial services on blockchain
- NFT: Non-Fungible Token — unique digital assets
- Always advise users to do their own research (DYOR) and never invest more than they can afford to lose

HOW TO RESPOND:
- Be friendly, professional and helpful
- Keep responses concise but complete
- Use emojis occasionally to keep it friendly
- Always encourage users to reach out on WhatsApp for business inquiries
- If asked about prices, explain that rates vary and they should contact us for current rates
- Never give specific financial advice — always say DYOR (Do Your Own Research)
- If you don't know something specific about UTL, say you'll pass the question to the team
- Always end business-related responses with a CTA to contact via WhatsApp`

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please reach out to us directly on WhatsApp: +2348038786037 📱"
      }])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Send message when Enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ✅ Handle quick question click
  const handleQuickQuestion = (question) => {
    setInput(question)
  }

  return (
    <>
      {/* ── Floating Chat Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg hover:shadow-blue-500/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        title="Chat with UTL AI"
      >
        {isOpen ? (
          // X icon when open
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Chat icon when closed
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Notification dot when closed */}
      {!isOpen && (
        <div className="fixed bottom-16 right-6 z-50 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          Ask me anything!
        </div>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '520px' }}>

          {/* Chat Header */}
          <div className="bg-[#0a0f2c] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                AI
              </div>
              <div>
                <p className="text-white font-bold text-sm">UTL AI Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-[10px]">Online • Powered by Claude</span>
                </div>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {/* ✅ Render line breaks properly */}
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={line === '' ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <p className="text-gray-400 text-[10px] font-semibold uppercase mb-2">Quick Questions</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask UTL AI anything..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-gray-300 text-[10px] text-center mt-2">
              Powered by Claude AI • Ultimate Tech Lab
            </p>
          </div>

        </div>
      )}
    </>
  )
}

export default ChatBot
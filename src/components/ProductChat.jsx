import { useState, useRef, useEffect } from 'react'
import { Bot, Store, Send, ArrowUpCircle, ShieldCheck } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * ProductChat
 *
 * AI-first Q&A widget for a single product. Every message starts with
 * Claude answering from the product's own data. If Claude can't help,
 * it flags that internally (needsVendor) and the UI offers a clear,
 * buyer-initiated "Ask the vendor instead" action — escalation is never
 * automatic, so the buyer always knows why a human just joined the chat.
 *
 * Usage: <ProductChat productId={product._id} />
 */
export default function ProductChat({ productId }) {
  const [inquiry, setInquiry] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVendor, setNeedsVendor] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [inquiry?.messages?.length])

  const token = () => localStorage.getItem('utl_token')

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setLoading(true)
    setNeedsVendor(false)

    try {
      const isEscalated = inquiry?.status === 'escalated'
      const endpoint = isEscalated
        ? `${BASE_URL}/inquiries/${inquiry._id}/buyer-reply`
        : `${BASE_URL}/products/${productId}/ask`

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(isEscalated ? { text } : { question: text }),
      })
      const data = await res.json()

      if (!data.success) {
        console.error('Chat error:', data.message)
        return
      }

      setInquiry(data.inquiry)
      if (data.needsVendor) setNeedsVendor(true)
    } catch (err) {
      console.error('Chat request failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const escalate = async () => {
    if (!inquiry) return
    try {
      const res = await fetch(`${BASE_URL}/inquiries/${inquiry._id}/escalate`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token()}` },
      })
      const data = await res.json()
      if (data.success) {
        setInquiry(data.inquiry)
        setNeedsVendor(false)
      }
    } catch (err) {
      console.error('Escalation failed:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[480px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Bot size={16} className="text-orange-600" />
          </div>
          <div>
            <p className="text-gray-900 text-sm font-bold">Ask about this product</p>
            <p className="text-gray-400 text-xs">
              {inquiry?.status === 'escalated' ? 'Now talking with the vendor' : 'Answered instantly by AI'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[10px]" title="All contact info is kept off this chat to protect both you and the vendor">
          <ShieldCheck size={13} />
          Protected chat
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {(!inquiry || inquiry.messages.length === 0) && (
          <div className="text-center py-8">
            <Bot size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-400 text-sm">Ask anything about price, stock, delivery or details — I'll answer instantly.</p>
          </div>
        )}

        {inquiry?.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.sender === 'buyer' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              {msg.sender !== 'buyer' && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 px-1">
                  {msg.sender === 'ai' ? (
                    <><Bot size={11} /> AI Assistant</>
                  ) : (
                    <><Store size={11} /> Vendor</>
                  )}
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'buyer'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : msg.sender === 'ai'
                      ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      : 'bg-blue-50 text-blue-900 rounded-bl-sm border border-blue-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {needsVendor && inquiry?.status !== 'escalated' && (
          <div className="flex justify-start">
            <button
              onClick={escalate}
              className="flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 hover:bg-orange-100 transition-colors"
            >
              <ArrowUpCircle size={14} /> I still need the vendor — ask them directly
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inquiry?.status === 'escalated' ? 'Message the vendor...' : 'Ask a question...'}
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors disabled:opacity-60"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="w-10 h-10 flex-shrink-0 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
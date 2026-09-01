/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'
import { X, Send, Phone, MessageCircle } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const POLL_INTERVAL_MS = 4000

/**
 * ChatWindow
 *
 * Deliberately driven by explicit props, not derived from the
 * conversation's populated fields — that's what lets the same
 * component serve product chat (buyer/vendor, both real Users) and
 * sourcing-request support chat (buyer/admin, admin has no User
 * document) without special-casing inside here.
 *
 * Props:
 * - conversationId: string
 * - viewerRole: 'buyer' | 'vendor' | 'admin'
 * - otherPartyName: string — shown in the header
 * - otherPartyPhone: string | null — omit the call button if null
 * - contextLabel: string | null — e.g. "Re: Tecno Spark 20 Pro"
 * - isAdminView: boolean — switches which endpoints/auth get used
 * - adminKey: string — only needed when isAdminView is true
 * - onClose: () => void
 */
export default function ChatWindow({
  conversationId, viewerRole, otherPartyName, otherPartyPhone,
  contextLabel, isAdminView = false, adminKey, onClose,
}) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  const authHeaders = () =>
    isAdminView
      ? { 'x-admin-key': adminKey }
      : { Authorization: `Bearer ${localStorage.getItem('utl_token')}` }

  const messagesUrl = isAdminView
    ? `${BASE_URL}/messages/admin/conversations/${conversationId}/messages`
    : `${BASE_URL}/messages/conversations/${conversationId}/messages`

  const fetchMessages = async () => {
    try {
      const res = await fetch(messagesUrl, { headers: authHeaders() })
      const data = await res.json()
      if (data.success) setMessages(data.messages)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL_MS)
    return () => clearInterval(pollRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const outgoing = text.trim()
    setText('')
    try {
      const res = await fetch(messagesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ text: outgoing }),
      })
      const data = await res.json()
      if (data.success) setMessages((prev) => [...prev, data.message])
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl h-[85vh] sm:h-[600px] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle size={18} className="text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-bold text-sm truncate">{otherPartyName}</p>
              {contextLabel && <p className="text-gray-400 text-xs truncate">{contextLabel}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {otherPartyPhone && (
              <a
                href={`tel:${otherPartyPhone}`}
                className="w-9 h-9 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                title={`Call ${otherPartyName}`}
              >
                <Phone size={16} />
              </a>
            )}
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="text-center py-10">
              <div className="inline-block w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-center py-10">
              <MessageCircle size={32} className="mx-auto mb-2 text-gray-200" />
              <p className="text-gray-400 text-sm">No messages yet — say hello.</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMine = msg.senderRole === viewerRole
            return (
              <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMine ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                  <p className={`text-[10px] mt-1 ${isMine ? 'text-orange-100' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-gray-100">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="w-10 h-10 flex items-center justify-center bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white rounded-full transition-colors flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Package, MessageCircle } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import ChatWindow from '../components/ChatWindow'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const STATUS_OPTIONS = ['pending', 'sourcing', 'ready', 'completed', 'cancelled']
const FULFILLMENT_OPTIONS = [
  { value: '', label: 'Not set yet' },
  { value: 'platform-delivery', label: 'Platform delivers directly' },
  { value: 'platform-pickup', label: 'Platform pickup station' },
  { value: 'utl-pickup', label: 'Pickup from UTL' },
  { value: 'utl-delivery', label: 'UTL delivery' },
]

export default function AdminSourcingRequestCard({ request, adminKey, onUpdated, flashMessage }) {
  const [savingItem, setSavingItem] = useState(null)
  const [fulfillmentMethod, setFulfillmentMethod] = useState(request.fulfillment?.method || '')
  const [fulfillmentDetails, setFulfillmentDetails] = useState(request.fulfillment?.details || '')
  const [chatConversation, setChatConversation] = useState(null)

  // ✅ Finds the buyer-initiated conversation for this request, if one
  // exists — admin never creates it, only the buyer does (clicking
  // "Message Support" from their dashboard)
  const openChat = async () => {
    try {
      const res = await fetch(`${BASE_URL}/messages/admin/sourcing/${request._id}/conversation`, {
        headers: { 'x-admin-key': adminKey },
      })
      const data = await res.json()
      if (data.success && data.conversation) {
        setChatConversation(data.conversation)
      } else {
        flashMessage('Customer hasn\'t started a chat on this request yet')
      }
    } catch (err) {
      console.error('Failed to open chat:', err)
    }
  }

  const updateItemProof = async (itemIndex, proof) => {
    setSavingItem(itemIndex)
    try {
      const res = await fetch(`${BASE_URL}/sourcing-requests/${request._id}/items/${itemIndex}/proof`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(proof),
      })
      const data = await res.json()
      if (data.success) {
        flashMessage('Proof saved')
        onUpdated(data.request)
      }
    } catch (err) {
      console.error('Proof update failed:', err)
    } finally {
      setSavingItem(null)
    }
  }

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`${BASE_URL}/sourcing-requests/${request._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ status, fulfillmentMethod, fulfillmentDetails }),
      })
      const data = await res.json()
      if (data.success) {
        flashMessage(`Request marked ${status}`)
        onUpdated(data.request)
      }
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  const saveFulfillment = async () => {
    try {
      const res = await fetch(`${BASE_URL}/sourcing-requests/${request._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ fulfillmentMethod, fulfillmentDetails }),
      })
      const data = await res.json()
      if (data.success) {
        flashMessage('Fulfillment saved — customer notified if status is "ready"')
        onUpdated(data.request)
      }
    } catch (err) {
      console.error('Fulfillment save failed:', err)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div>
          <p className="text-gray-900 font-bold text-sm">{request.requestNumber}</p>
          <p className="text-gray-500 text-xs">
            {request.customerId?.firstName} {request.customerId?.lastName} ({request.customerId?.email}) · {request.contactPhone}
          </p>
          {request.notes && <p className="text-gray-400 text-xs mt-1 italic">"{request.notes}"</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openChat}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
          >
            <MessageCircle size={13} /> Chat
          </button>
          <select
            value={request.status}
            onChange={(e) => updateStatus(e.target.value)}
            className={`text-xs font-bold px-3 py-2 rounded-lg border-0 capitalize cursor-pointer ${
              request.status === 'completed' ? 'bg-green-100 text-green-700' :
              request.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              request.status === 'ready' ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Items with per-item proof upload */}
      <div className="space-y-3 mb-4">
        {request.items.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-orange-600 font-bold text-xs">{item.platform}</span>
                <p className="text-gray-700 text-sm">{item.description}</p>
                {item.budget && <p className="text-gray-400 text-xs">Customer budget: ₦{item.budget.toLocaleString()}</p>}
              </div>
              {item.referenceImageUrls?.length > 0 && (
                <div className="flex gap-1.5 flex-shrink-0">
                  {item.referenceImageUrls.map((url, imgI) => (
                    <a key={imgI} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt="reference" className="w-12 h-12 rounded-lg object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Purchase Proof</label>
                <ImageUpload
                  value={item.sourcingProof?.screenshotUrl}
                  onChange={(url) => updateItemProof(i, { screenshotUrl: url })}
                  label="Upload screenshot"
                />
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">External Order #</label>
                  <input
                    type="text"
                    defaultValue={item.sourcingProof?.externalOrderNumber}
                    onBlur={(e) => updateItemProof(i, { externalOrderNumber: e.target.value })}
                    placeholder="e.g. Jumia order ID"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Actual Price (₦)</label>
                  <input
                    type="number"
                    defaultValue={item.sourcingProof?.actualPrice}
                    onBlur={(e) => updateItemProof(i, { actualPrice: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
            {savingItem === i && <p className="text-orange-500 text-[10px] mt-2">Saving...</p>}
          </div>
        ))}
      </div>

      {/* Fulfillment — filled in once ready */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Fulfillment (set before marking "ready")</p>
        <div className="grid sm:grid-cols-2 gap-2">
          <select
            value={fulfillmentMethod}
            onChange={(e) => setFulfillmentMethod(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
          >
            {FULFILLMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input
            type="text"
            value={fulfillmentDetails}
            onChange={(e) => setFulfillmentDetails(e.target.value)}
            placeholder="Details — station name, address, etc."
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
          />
        </div>
        <button
          onClick={saveFulfillment}
          className="mt-2 flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
        >
          <Package size={12} /> Save Fulfillment Details
        </button>
      </div>

      {chatConversation && (
        <ChatWindow
          conversationId={chatConversation._id}
          viewerRole="admin"
          isAdminView
          adminKey={adminKey}
          otherPartyName={`${chatConversation.buyerId?.firstName} ${chatConversation.buyerId?.lastName}`}
          otherPartyPhone={chatConversation.buyerId?.phone}
          contextLabel={request.requestNumber}
          onClose={() => setChatConversation(null)}
        />
      )}
    </div>
  )
}
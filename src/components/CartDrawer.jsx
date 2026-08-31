import { useState } from 'react'
import { X, Trash2, ShoppingBag, Send } from 'lucide-react'
import { useCart } from '../context/CartContext'
import SourcingRequestConfirmation from './SourcingRequestConfirmation'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, clearCart } = useCart()
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmedRequest, setConfirmedRequest] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      localStorage.setItem('utl_redirect_after_login', '/shop/ultimate')
      window.location.href = '/login'
      return
    }
    if (!contactPhone.trim()) {
      setError('Please add a contact phone number')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/sourcing-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            platform: i.platform,
            description: i.description,
            referenceImageUrls: i.referenceImageUrls || [],
            budget: i.budget || null,
          })),
          contactPhone,
          notes,
        }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }

      const user = JSON.parse(currentUser)
      localStorage.setItem('utl_current_user', JSON.stringify({ ...user, dashboardUnlocked: true }))
      setConfirmedRequest(data.request)
      clearCart()
    } catch (err) {
      console.error('Request submission failed:', err)
      setError('Network error — please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setConfirmedRequest(null)
    setError('')
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 bg-black/50 z-40" />

      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="flex items-center gap-2 font-black text-gray-900">
            <ShoppingBag size={18} className="text-orange-500" />
            {confirmedRequest ? 'Request Sent' : 'Your Requests'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {confirmedRequest ? (
          <div className="flex-1 overflow-y-auto">
            <SourcingRequestConfirmation request={confirmedRequest} onContinue={handleClose} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {items.length === 0 && (
                <div className="text-center py-16">
                  <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-400 text-sm">No requests added yet</p>
                </div>
              )}

              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border border-gray-100 rounded-xl p-3">
                  {item.referenceImageUrls?.length > 0 && (
                    <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.referenceImageUrls[0]} alt="" className="w-full h-full object-cover" />
                      {item.referenceImageUrls.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-bold px-1 rounded-tl">
                          +{item.referenceImageUrls.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-orange-600 font-semibold text-xs">{item.platform}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{item.description}</p>
                    {item.budget && <p className="text-gray-400 text-xs mt-0.5">Budget: ₦{item.budget.toLocaleString()}</p>}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-3">
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Contact phone *"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
                />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes — preferred area, pickup vs delivery, anything else (optional)"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all"
                >
                  <Send size={16} /> {submitting ? 'Sending...' : `Send Request (${items.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
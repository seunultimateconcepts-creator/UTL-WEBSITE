import { useState } from 'react'
import { Wrench, MapPin, Zap } from 'lucide-react'

/**
 * ServiceRequestForm
 *
 * Checkout form for the 'service-request' mode — a plumber callout,
 * an electrician, a freelance gig, a logistics pickup. No fixed date
 * or delivery address: the customer describes what they need and
 * where, and the vendor responds directly to arrange it (see
 * getCheckoutMode in listingCategoryFields.js).
 *
 * This is deliberately the loosest of the four modes. For a lot of
 * artisan work the real price and timing genuinely can't be known
 * until the vendor sees the job — so this creates the order as a
 * request, and the conversation happens from there via the existing
 * chat/call flow.
 *
 * onSubmit receives { description, location, urgency }
 * — matches Order.serviceRequestDetails.
 */
export default function ServiceRequestForm({ onSubmit, submitting, submitLabel = 'Send Request' }) {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) {
      setError('Please describe what you need')
      return
    }
    if (!location.trim()) {
      setError('Please add a location so the vendor knows where to go')
      return
    }
    setError('')
    onSubmit({ description: description.trim(), location: location.trim(), urgency })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="flex items-center gap-2 mb-1">
        <Wrench size={16} className="text-orange-500" />
        <h3 className="text-gray-900 font-bold text-sm">Request This Service</h3>
      </div>

      <p className="text-gray-400 text-xs -mt-2">
        The vendor will review your request and get in touch to confirm timing and final price.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">What do you need? *</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the job — what's wrong, what you'd like done, any details that help"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 items-center gap-1.5">
          <MapPin size={12} /> Location *
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Area / address where the work is needed"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 items-center gap-1.5">
          <Zap size={12} /> How soon?
        </label>
        <div className="flex gap-2">
          {[
            { id: 'normal', label: 'Normal' },
            { id: 'urgent', label: 'Urgent' },
          ].map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUrgency(u.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                urgency === u.id
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors text-sm"
      >
        {submitting ? 'Sending...' : submitLabel}
      </button>
    </form>
  )
}
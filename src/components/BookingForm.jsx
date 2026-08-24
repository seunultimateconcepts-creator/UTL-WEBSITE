import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

const SERVICE_TYPES = [
  'Web Development Consultation',
  'Crypto Mentorship Session',
  'Shopping Assistance Consult',
  'Other',
]

const DURATIONS = ['30 minutes', '1 hour', '2 hours']

/**
 * BookingForm
 *
 * Usage: <BookingForm onSubmit={(data) => ...} submitting={bool} />
 * onSubmit receives { serviceType, scheduledDate, duration, notes, contactPhone }
 */
export default function BookingForm({ onSubmit, submitting, defaultPhone = '' }) {
  const [form, setForm] = useState({
    serviceType: '',
    date: '',
    time: '',
    duration: '1 hour',
    notes: '',
    contactPhone: defaultPhone,
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.serviceType || !form.date || !form.time || !form.contactPhone) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    const scheduledDate = new Date(`${form.date}T${form.time}`).toISOString()
    onSubmit({
      serviceType: form.serviceType,
      scheduledDate,
      duration: form.duration,
      notes: form.notes,
      contactPhone: form.contactPhone,
    })
  }

  // Prevent picking a date in the past
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Service *</label>
        <select
          name="serviceType" value={form.serviceType} onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="">Select a service</option>
          {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
            <Calendar size={12} /> Date *
          </label>
          <input
            type="date" name="date" value={form.date} min={today} onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
            <Clock size={12} /> Time *
          </label>
          <input
            type="time" name="time" value={form.time} onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Duration</label>
        <select
          name="duration" value={form.duration} onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-amber-400 transition-colors"
        >
          {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Contact Phone *</label>
        <input
          type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange}
          placeholder="+234 800 000 0000"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notes (optional)</label>
        <textarea
          name="notes" rows={3} value={form.notes} onChange={handleChange}
          placeholder="Anything we should know before the session..."
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm"
      >
        {submitting ? 'Booking...' : 'Request Booking'}
      </button>
    </form>
  )
}
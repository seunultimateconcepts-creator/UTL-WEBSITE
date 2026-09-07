import { useState } from 'react'
import { Calendar, Users } from 'lucide-react'

/**
 * BookingDateForm
 *
 * The date-based counterpart to AddressForm.jsx — used at checkout
 * for categories in BOOKING_CATEGORIES (see listingCategoryFields.js)
 * where a delivery address doesn't apply: a hotel stay, a property
 * viewing, an event date, a travel departure.
 *
 * `isRange` (Hotel only, per RANGE_DATE_CATEGORIES) shows a checkout
 * date field too; everything else just needs one date.
 *
 * `bookedDates` — array of { startDate, endDate } already taken for
 * this product (from GET /orders/booked-dates/:productId). Shown as a
 * plain list and checked client-side before submit — a UX convenience
 * only, since the real enforcement is server-side in createOrder.
 *
 * Usage:
 * <BookingDateForm isRange={boolean} bookedDates={array} onSubmit={(bookingData) => ...} submitting={bool} />
 * onSubmit receives { startDate, endDate, guests, details }
 */
export default function BookingDateForm({ isRange, bookedDates = [], onSubmit, submitting, submitLabel = 'Continue' }) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    guests: '',
    details: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ✅ Same overlap logic as the backend's authoritative check in
  // createOrder — duplicated here only so the person gets an
  // immediate answer instead of a round-trip rejection. If this ever
  // drifts from the backend's logic, the backend still wins.
  const overlapsBookedDate = (start, end) => {
    return bookedDates.some((b) => {
      const bookedStart = new Date(b.startDate)
      const bookedEnd = new Date(b.endDate)
      return start <= bookedEnd && end >= bookedStart
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.startDate) {
      setError(isRange ? 'Please select a check-in date' : 'Please select a date')
      return
    }
    if (isRange && form.endDate && form.endDate <= form.startDate) {
      setError('Check-out date must be after check-in date')
      return
    }
    const start = new Date(form.startDate)
    const end = isRange && form.endDate ? new Date(form.endDate) : start
    if (overlapsBookedDate(start, end)) {
      setError('Those dates are already booked. Please choose different dates.')
      return
    }
    setError('')
    onSubmit({
      startDate: form.startDate,
      endDate: isRange ? (form.endDate || null) : null,
      guests: form.guests ? Number(form.guests) : null,
      details: form.details,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="flex items-center gap-2 mb-1">
        <Calendar size={16} className="text-orange-500" />
        <h3 className="text-gray-900 font-bold text-sm">{isRange ? 'Stay Dates' : 'Booking Date'}</h3>
      </div>

      {bookedDates.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
          <p className="text-gray-500 text-xs font-semibold mb-1">Already booked:</p>
          <ul className="text-gray-500 text-xs space-y-0.5">
            {bookedDates.map((b, i) => (
              <li key={i}>
                {new Date(b.startDate).toLocaleDateString()}
                {b.endDate && b.endDate !== b.startDate && ` — ${new Date(b.endDate).toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className={isRange ? 'grid grid-cols-2 gap-3' : ''}>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            {isRange ? 'Check-in *' : 'Date *'}
          </label>
          <input
            type="date" name="startDate" value={form.startDate} onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>
        {isRange && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Check-out *</label>
            <input
              type="date" name="endDate" value={form.endDate} onChange={handleChange}
              min={form.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 items-center gap-1.5">
          <Users size={12} /> Guests (optional)
        </label>
        <input
          type="number" name="guests" min="1" value={form.guests} onChange={handleChange}
          placeholder="Number of guests"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notes (optional)</label>
        <textarea
          name="details" rows={2} value={form.details} onChange={handleChange}
          placeholder="Anything the vendor should know — arrival time, special requests, etc."
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors text-sm"
      >
        {submitting ? 'Placing Order...' : submitLabel}
      </button>
    </form>
  )
}
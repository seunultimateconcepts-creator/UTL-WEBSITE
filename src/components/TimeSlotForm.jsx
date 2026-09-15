import { useState } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { DAILY_TIME_SLOTS } from '../config/listingCategoryFields'

/**
 * TimeSlotForm
 *
 * Checkout form for the 'time-slot' mode — a barber, salon, tailor
 * fitting, or anything else booked as a specific appointment on a
 * specific day (see getCheckoutMode in listingCategoryFields.js).
 *
 * `bookedSlots` — [{ date: 'YYYY-MM-DD', slot: '14:00' }] already
 * taken for this product, from GET /orders/booked-dates/:productId.
 * Slots for the selected day get disabled. Like the date version,
 * this is a UX convenience only — the real enforcement is the exact
 * date+slot conflict check in createOrder.
 *
 * ⚠️ Known simplification: DAILY_TIME_SLOTS is one shared, fixed set
 * of hourly slots for every vendor. Per-vendor working hours, days
 * off, lunch breaks, and variable appointment lengths are a real
 * scheduling system — deliberately not pretending to have that yet.
 *
 * onSubmit receives { startDate, endDate: null, timeSlot, details }
 * — shaped to match Order.bookingDetails so checkout treats it the
 * same as a date booking.
 */
export default function TimeSlotForm({ bookedSlots = [], onSubmit, submitting, submitLabel = 'Book Appointment' }) {
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')

  const takenSlotsForDate = bookedSlots
    .filter((b) => b.date === date)
    .map((b) => b.slot)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!date) {
      setError('Please choose a date')
      return
    }
    if (!slot) {
      setError('Please choose a time')
      return
    }
    setError('')
    onSubmit({ startDate: date, endDate: null, timeSlot: slot, details })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={16} className="text-orange-500" />
        <h3 className="text-gray-900 font-bold text-sm">Book an Appointment</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
          <Calendar size={12} /> Date *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setSlot(''); setError('') }}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      {date && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Available times *</label>
          <div className="grid grid-cols-4 gap-2">
            {DAILY_TIME_SLOTS.map((s) => {
              const taken = takenSlotsForDate.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  disabled={taken}
                  onClick={() => { setSlot(s); setError('') }}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    taken
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed line-through'
                      : slot === s
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
          {takenSlotsForDate.length > 0 && (
            <p className="text-gray-400 text-[11px] mt-1.5">Greyed-out times are already booked.</p>
          )}
        </div>
      )}

      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
          <MapPin size={12} /> Notes (optional)
        </label>
        <textarea
          rows={2}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Anything the vendor should know before your appointment"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors text-sm"
      >
        {submitting ? 'Booking...' : submitLabel}
      </button>
    </form>
  )
}
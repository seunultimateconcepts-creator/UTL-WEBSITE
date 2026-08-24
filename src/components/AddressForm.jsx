import { useState, useEffect } from 'react'
import { MapPin, Truck } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * AddressForm
 *
 * Fetches the zone list (with fees) from the backend rather than
 * hardcoding it here — deliveryZones.js on the server is the single
 * source of truth, this just displays it.
 *
 * Usage:
 * <AddressForm onSubmit={(addressData) => ...} submitting={bool} />
 * onSubmit receives { fullName, phone, coverageZone, address, landmark }
 */
export default function AddressForm({ onSubmit, submitting, submitLabel = 'Continue' }) {
  const [zones, setZones] = useState([])
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    coverageZone: '',
    address: '',
    landmark: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    // Zones list — public, no auth needed
    fetch(`${BASE_URL}/orders/delivery-zones`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setZones(data.zones) })
      .catch((err) => console.error('Failed to load delivery zones:', err))

    // Prefill from last order's address, if any
    const token = localStorage.getItem('utl_token')
    if (!token) return
    fetch(`${BASE_URL}/orders/last-address`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setForm((prev) => ({
            ...prev,
            phone: data.address?.phone || data.phone || prev.phone,
            fullName: data.address?.fullName || prev.fullName,
            coverageZone: data.address?.coverageZone || prev.coverageZone,
            address: data.address?.address || prev.address,
            landmark: data.address?.landmark || prev.landmark,
          }))
        }
      })
      .catch((err) => console.error('Failed to load saved address:', err))
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const selectedZone = zones.find((z) => z.id === form.coverageZone)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.coverageZone || !form.address) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={16} className="text-orange-500" />
        <h3 className="text-gray-900 font-bold text-sm">Delivery Address</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name *</label>
          <input
            type="text" name="fullName" value={form.fullName} onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone *</label>
          <input
            type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="+234 800 000 0000"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Coverage Zone *</label>
        <select
          name="coverageZone" value={form.coverageZone} onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
        >
          <option value="">Select your area</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>{z.label} — ₦{z.fee.toLocaleString()}</option>
          ))}
        </select>
        {selectedZone && (
          <p className="flex items-center gap-1.5 text-gray-400 text-xs mt-1.5">
            <Truck size={12} /> Delivery fee: ₦{selectedZone.fee.toLocaleString()} · Est. {selectedZone.estimatedDays}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Delivery Address *</label>
        <textarea
          name="address" rows={2} value={form.address} onChange={handleChange}
          placeholder="Street address, city, state"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Landmark (optional)</label>
        <input
          type="text" name="landmark" value={form.landmark} onChange={handleChange}
          placeholder="Nearby bus stop, building, etc."
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
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
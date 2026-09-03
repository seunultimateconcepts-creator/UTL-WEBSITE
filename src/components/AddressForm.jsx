import { useState, useEffect } from 'react'
import { MapPin, Truck } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * AddressForm
 *
 * State drives the delivery fee (via deliveryZones.js, server-side —
 * never trusted from here). LGA is a second, dependent dropdown purely
 * for address accuracy — once picked, it prefixes the free-text
 * address field as a starting point, since Order's schema doesn't have
 * a dedicated LGA field of its own (kept that way deliberately, rather
 * than a wider schema change just for this).
 *
 * Usage:
 * <AddressForm onSubmit={(addressData) => ...} submitting={bool} />
 * onSubmit receives { fullName, phone, coverageZone, address, landmark }
 * coverageZone is now the real STATE NAME (e.g. "Lagos", "Edo").
 */
export default function AddressForm({ onSubmit, submitting, submitLabel = 'Continue' }) {
  const [zones, setZones] = useState([])
  const [statesLGAs, setStatesLGAs] = useState({})
  const [selectedLGA, setSelectedLGA] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    coverageZone: '', // now holds the STATE name
    address: '',
    landmark: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    // Zones list (states, with fee/ETA) — public, no auth needed
    fetch(`${BASE_URL}/orders/delivery-zones`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setZones(data.zones) })
      .catch((err) => console.error('Failed to load delivery zones:', err))

    // Full State → LGA map, for the second dropdown
    fetch(`${BASE_URL}/orders/nigeria-lgas`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setStatesLGAs(data.statesLGAs) })
      .catch((err) => console.error('Failed to load LGA list:', err))

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

  // ✅ Changing state resets the LGA choice — an LGA from the old
  // state selection would be meaningless once the state changes
  const handleStateChange = (e) => {
    setForm((prev) => ({ ...prev, coverageZone: e.target.value }))
    setSelectedLGA('')
  }

  // ✅ Picking an LGA prefixes the address field as a starting point —
  // customer fills in the rest (street, landmark detail) after
  const handleLGAChange = (e) => {
    const lga = e.target.value
    setSelectedLGA(lga)
    if (lga) {
      setForm((prev) => ({
        ...prev,
        address: prev.address.startsWith(lga) ? prev.address : `${lga}, ${prev.address}`.replace(/^, /, ''),
      }))
    }
  }

  const selectedZone = zones.find((z) => z.id === form.coverageZone)
  const lgasForState = statesLGAs[form.coverageZone] || []

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">State *</label>
          <select
            name="coverageZone" value={form.coverageZone} onChange={handleStateChange}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
          >
            <option value="">Select state</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            LGA {lgasForState.length > 0 && <span className="text-gray-400 font-normal">(optional)</span>}
          </label>
          <select
            value={selectedLGA} onChange={handleLGAChange}
            disabled={!form.coverageZone}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">{form.coverageZone ? 'Select LGA' : 'Pick a state first'}</option>
            {lgasForState.map((lga) => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedZone && (
        <p className="flex items-center gap-1.5 text-gray-400 text-xs -mt-2">
          <Truck size={12} /> Delivery fee: ₦{selectedZone.fee.toLocaleString()} · Est. {selectedZone.estimatedDays}
        </p>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Delivery Address *</label>
        <textarea
          name="address" rows={2} value={form.address} onChange={handleChange}
          placeholder="Street address, city"
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
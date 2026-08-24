/* eslint-disable no-undef */

/**
 * deliveryZones.js
 *
 * ✅ Server is the ONLY source of truth for delivery fees and ETAs.
 * The frontend fetches this list via GET /api/delivery-zones and only
 * ever sends back the zone id — never a fee amount. orderController.js
 * looks the fee up from here, so nobody can submit a fake ₦0 delivery
 * fee from the browser's dev tools.
 *
 * Flat zone-based pricing for now (matches the original checkout plan:
 * "Address with coverage-zone dropdown"). Real distance-based pricing
 * via Google Distance Matrix is a Stage 2 upgrade once you have real
 * delivery data to calibrate against — this is deliberately simple to
 * ship today.
 *
 * Edit this list freely — it's the one place zone/fee/ETA changes happen.
 */
const DELIVERY_ZONES = [
  { id: 'lagos-mainland', label: 'Lagos Mainland', fee: 2000, estimatedDays: '2-3 business days' },
  { id: 'lagos-island', label: 'Lagos Island', fee: 2500, estimatedDays: '2-3 business days' },
  { id: 'edo-benin', label: 'Edo State (Benin City)', fee: 1500, estimatedDays: '1-2 business days' },
  { id: 'abuja', label: 'Abuja (FCT)', fee: 3500, estimatedDays: '3-5 business days' },
  { id: 'other-states', label: 'Other Nigerian States', fee: 4500, estimatedDays: '5-7 business days' },
]

const getZoneInfo = (zoneId) => {
  return DELIVERY_ZONES.find((z) => z.id === zoneId) || null
}

module.exports = { DELIVERY_ZONES, getZoneInfo }
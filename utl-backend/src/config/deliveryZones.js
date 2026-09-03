/* eslint-disable no-undef */
const { NIGERIA_STATES_LGAS } = require('./nigeriaStatesLGAs')

/**
 * deliveryZones.js
 *
 * ✅ "Zone" is now just the STATE the customer selected — e.g. "Lagos",
 * "Edo", "Kano" — not an arbitrary zone id anymore, now that the full
 * State → LGA dropdown exists. Server is still the ONLY source of
 * truth for the actual fee; the frontend only ever sends back the
 * state NAME, never a price.
 *
 * Four states have real, calibrated fees — the ones actually being
 * delivered to regularly. Every other state (all 33 others + FCT gets
 * its own too) uses the same flat default until there's real delivery
 * data to calibrate against. Distance-based pricing via Google Distance
 * Matrix remains the Stage 2 upgrade, unchanged from the original plan.
 */
const STATE_DELIVERY_FEES = {
  'Lagos': { fee: 2000, estimatedDays: '2-3 business days' },
  'Edo': { fee: 1500, estimatedDays: '1-2 business days' },
  'FCT': { fee: 3500, estimatedDays: '3-5 business days' },
  'Ekiti': { fee: 3000, estimatedDays: '3-4 business days' },
}
const DEFAULT_STATE_FEE = { fee: 4500, estimatedDays: '5-7 business days' }

const ALL_STATE_NAMES = Object.keys(NIGERIA_STATES_LGAS)

// ✅ Full list for the frontend's State dropdown, fee/ETA included so
// the customer sees the real cost before they even submit — but this
// is DISPLAY only, never trusted back from the client at order time.
const DELIVERY_ZONES = ALL_STATE_NAMES.map((state) => {
  const feeInfo = STATE_DELIVERY_FEES[state] || DEFAULT_STATE_FEE
  return { id: state, label: state, ...feeInfo }
})

// ✅ Server-side lookup used at order creation — recomputes the fee
// from the state name itself, never from anything the client sent.
const getZoneInfo = (stateName) => {
  if (!NIGERIA_STATES_LGAS[stateName]) return null // not a real state — reject
  const feeInfo = STATE_DELIVERY_FEES[stateName] || DEFAULT_STATE_FEE
  return { id: stateName, label: stateName, ...feeInfo }
}

module.exports = { DELIVERY_ZONES, getZoneInfo, ALL_STATE_NAMES }
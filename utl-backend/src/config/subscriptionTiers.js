/* eslint-disable no-undef */

/**
 * subscriptionTiers.js
 *
 * ✅ Server-controlled, same principle as deliveryZones.js — the
 * frontend displays these, never invents or overrides them.
 *
 * maxListings counts ACTIVE slots only (see productController.js's
 * countActiveSlots) — not lifetime uploads ever. A product that sells
 * out (stock hits 0) frees its slot immediately. A product that gets
 * manually deleted stays counted for DELETE_COOLDOWN_DAYS, specifically
 * to stop delete-and-relist as a way to dodge the cap.
 */
const SUBSCRIPTION_TIERS = {
  free: { label: 'Free', maxListings: 10, videoAllowed: false, price: 0 },
  silver: { label: 'Silver', maxListings: 40, videoAllowed: false, price: 20000 },
  gold: { label: 'Gold', maxListings: 100, videoAllowed: false, price: 50000 },
  platinum: { label: 'Platinum', maxListings: Infinity, videoAllowed: true, price: 100000 },
}

const DELETE_COOLDOWN_DAYS = 90

module.exports = { SUBSCRIPTION_TIERS, DELETE_COOLDOWN_DAYS }
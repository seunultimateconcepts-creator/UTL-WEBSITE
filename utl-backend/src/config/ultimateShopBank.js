/* eslint-disable no-undef */

/**
 * ultimateShopBank.js
 *
 * UTL's OWN bank account — used for Ultimate Shop / sourcing-request
 * payments specifically, where UTL itself is the seller (sourcing an
 * item from Jumia/Amazon/etc on the customer's behalf), not a
 * marketplace vendor. This is why it's an env-based config here
 * rather than a field on a User document — there's no vendor account
 * this belongs to.
 *
 * Set these in Railway: ULTIMATE_SHOP_BANK_NAME, ULTIMATE_SHOP_ACCOUNT_NUMBER,
 * ULTIMATE_SHOP_ACCOUNT_NAME. Returns null (not a fake placeholder)
 * when unset, so the frontend can correctly show "not available yet"
 * instead of a blank/broken-looking account.
 */
const getUltimateShopBankDetails = () => {
  const { ULTIMATE_SHOP_BANK_NAME, ULTIMATE_SHOP_ACCOUNT_NUMBER, ULTIMATE_SHOP_ACCOUNT_NAME } = process.env
  if (!ULTIMATE_SHOP_BANK_NAME || !ULTIMATE_SHOP_ACCOUNT_NUMBER || !ULTIMATE_SHOP_ACCOUNT_NAME) {
    return null
  }
  return {
    bankName: ULTIMATE_SHOP_BANK_NAME,
    accountNumber: ULTIMATE_SHOP_ACCOUNT_NUMBER,
    accountName: ULTIMATE_SHOP_ACCOUNT_NAME,
  }
}

module.exports = { getUltimateShopBankDetails }
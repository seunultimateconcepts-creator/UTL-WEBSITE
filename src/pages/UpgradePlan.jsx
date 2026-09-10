/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowLeft, Landmark, Clock } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TIERS = [
  { id: 'silver', name: 'Silver', price: 20000, features: ['Up to 40 products', 'Everything in Free'] },
  { id: 'gold', name: 'Gold', price: 50000, features: ['Up to 100 products', 'Everything in Silver'], featured: true },
  { id: 'platinum', name: 'Platinum', price: 100000, features: ['Unlimited products', 'Product videos', 'Everything in Gold'] },
]

/**
 * UpgradePlan
 *
 * Replaces the old Paystack Inline flow — verification wasn't going
 * through reliably, so this uses the same manual-bank-transfer-then-
 * admin-confirms pattern already proven for vendor-customer orders
 * and sourcing requests. The vendor picks a tier, sees UTL's own bank
 * account (config/ultimateShopBank.js on the backend), transfers, and
 * waits for admin to confirm — at which point the tier activates
 * automatically and they get a notification + email.
 */
function UpgradePlan() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [requesting, setRequesting] = useState(null) // which tier id is mid-request
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null) // { tier, amount, bankDetails } once requested

  useEffect(() => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(currentUser)
    if (parsed.sellerStatus !== 'approved') {
      navigate('/dashboard')
      return
    }
    setUser(parsed)

    // ✅ BUG FIX: this used to set bankDetails: null here and never
    // fetch the real thing — so a seller who requested an upgrade,
    // then simply refreshed the page (or navigated away and back),
    // would see "bank details aren't available" forever, even though
    // they genuinely are configured. request-upgrade is safe to call
    // again with the same tier — it just re-confirms the pending
    // request and hands back the real bank details, same as the first
    // time.
    if (parsed.subscription?.pendingTier) {
      refreshPendingDetails(parsed.subscription.pendingTier)
    }
  }, [navigate])

  const refreshPendingDetails = async (tier) => {
    setPending({ tier, amount: null, bankDetails: null }) // show the pending screen immediately, fill in details once fetched
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/sellers/request-upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (data.success) {
        setPending({ tier, amount: data.amount, bankDetails: data.bankDetails })
      }
    } catch (err) {
      console.error('Failed to refresh pending upgrade details:', err)
    }
  }

  const handleRequestUpgrade = async (tier) => {
    setError('')
    setRequesting(tier.id)
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/sellers/request-upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tier: tier.id }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }
      setPending({ tier: tier.id, amount: data.amount, bankDetails: data.bankDetails })

      const currentUser = JSON.parse(localStorage.getItem('utl_current_user'))
      const updated = { ...currentUser, subscription: { ...currentUser.subscription, pendingTier: tier.id } }
      localStorage.setItem('utl_current_user', JSON.stringify(updated))
    } catch (err) {
      console.error('Upgrade request failed:', err)
      setError('Network error — please check your connection and try again.')
    } finally {
      setRequesting(null)
    }
  }

  if (!user) return null

  const pendingTierInfo = pending ? TIERS.find((t) => t.id === pending.tier) : null

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {pending ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 text-amber-600 mb-4">
              <Clock size={18} />
              <span className="font-bold text-sm">Awaiting payment confirmation</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Upgrade to {pendingTierInfo?.name || pending.tier} requested
            </h1>
            <p className="text-gray-500 mb-6">
              Transfer the amount below, then wait for confirmation — your plan activates automatically the moment it's confirmed, with a notification and email.
            </p>

            {pending.bankDetails?.accountNumber ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-2">
                <div className="flex items-center gap-2 mb-3">
                  <Landmark size={16} className="text-blue-600" />
                  <span className="text-blue-900 font-bold text-sm">Transfer To</span>
                </div>
                <div className="bg-white rounded-xl p-4 space-y-1.5">
                  <p className="text-gray-900 text-sm"><span className="text-gray-400">Bank:</span> <span className="font-semibold">{pending.bankDetails.bankName}</span></p>
                  <p className="text-gray-900 text-sm"><span className="text-gray-400">Account Number:</span> <span className="font-semibold">{pending.bankDetails.accountNumber}</span></p>
                  <p className="text-gray-900 text-sm"><span className="text-gray-400">Account Name:</span> <span className="font-semibold">{pending.bankDetails.accountName}</span></p>
                  {pending.amount && (
                    <p className="text-gray-900 text-sm pt-1.5 border-t border-gray-100 mt-1.5">
                      <span className="text-gray-400">Amount:</span> <span className="font-bold text-amber-600">₦{pending.amount.toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-2">
                <p className="text-gray-500 text-sm">Bank details aren't available right now — please contact support to complete this upgrade.</p>
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Upgrade Your Plan</h1>
            <p className="text-gray-500 mb-8">List more products, unlock video uploads on Platinum.</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-5">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl p-6 border-2 ${tier.featured ? 'border-amber-400 shadow-lg' : 'border-gray-100 shadow-sm'}`}
                >
                  <h3 className="text-gray-900 font-black text-lg mb-1">{tier.name}</h3>
                  <p className="text-2xl font-black text-gray-900 mb-4">
                    ₦{tier.price.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/year</span>
                  </p>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={14} className="text-green-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleRequestUpgrade(tier)}
                    disabled={requesting === tier.id}
                    className={`w-full py-3 font-bold rounded-xl text-sm transition-colors ${
                      tier.featured
                        ? 'bg-amber-500 hover:bg-amber-400 text-[#0a0f2c]'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    } disabled:opacity-60`}
                  >
                    {requesting === tier.id ? 'Requesting...' : `Upgrade to ${tier.name}`}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 justify-center mt-8 text-gray-400 text-xs">
              <Landmark size={14} /> Paid by direct bank transfer, confirmed manually
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UpgradePlan
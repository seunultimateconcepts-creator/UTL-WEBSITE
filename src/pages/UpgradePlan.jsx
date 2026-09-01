/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowLeft, ShieldCheck } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

const TIERS = [
  { id: 'silver', name: 'Silver', price: 20000, features: ['Up to 40 products', 'Everything in Free'] },
  { id: 'gold', name: 'Gold', price: 50000, features: ['Up to 100 products', 'Everything in Silver'], featured: true },
  { id: 'platinum', name: 'Platinum', price: 100000, features: ['Unlimited products', 'Product videos', 'Everything in Gold'] },
]

function UpgradePlan() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [paying, setPaying] = useState(null) // which tier id is mid-payment
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(currentUser)
    if (parsed.sellerStatus !== 'approved') {
      // ✅ This is the sequencing rule — payment only exists AFTER
      // verification, never before
      navigate('/dashboard')
      return
    }
    setUser(parsed)

    // Load Paystack Inline JS once
    if (!document.getElementById('paystack-inline-script')) {
      const script = document.createElement('script')
      script.id = 'paystack-inline-script'
      script.src = 'https://js.paystack.co/v1/inline.js'
      document.body.appendChild(script)
    }
  }, [navigate])

  const handlePay = (tier) => {
    if (!window.PaystackPop) {
      setError('Payment system is still loading — please try again in a moment')
      return
    }
    setError('')
    setPaying(tier.id)

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: tier.price * 100, // Paystack expects kobo
      metadata: { tier: tier.id, userId: user.id || user._id },
      callback: (response) => verifyPayment(response.reference, tier),
      onClose: () => setPaying(null),
    })
    handler.openIframe()
  }

  const verifyPayment = async (reference, tier) => {
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/sellers/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reference }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Payment could not be verified — contact support if you were charged')
        return
      }
      setSuccess(tier)
    } catch (err) {
      console.error('Verification failed:', err)
      setError('Network error verifying payment — contact support if you were charged')
    } finally {
      setPaying(null)
    }
  }

  if (!user) return null

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {success ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">You're on {success.name}!</h1>
            <p className="text-gray-500 mb-6">Your new listing limit is active immediately.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors"
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
                    onClick={() => handlePay(tier)}
                    disabled={paying === tier.id}
                    className={`w-full py-3 font-bold rounded-xl text-sm transition-colors ${
                      tier.featured
                        ? 'bg-amber-500 hover:bg-amber-400 text-[#0a0f2c]'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    } disabled:opacity-60`}
                  >
                    {paying === tier.id ? 'Processing...' : `Pay ₦${tier.price.toLocaleString()}`}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 justify-center mt-8 text-gray-400 text-xs">
              <ShieldCheck size={14} /> Secured by Paystack
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UpgradePlan
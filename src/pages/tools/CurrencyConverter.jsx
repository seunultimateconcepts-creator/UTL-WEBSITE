import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, DollarSign, ArrowLeftRight } from 'lucide-react'

const CURRENCIES = {
  USD: 'US Dollar', NGN: 'Nigerian Naira', GBP: 'British Pound', EUR: 'Euro',
  CAD: 'Canadian Dollar', GHS: 'Ghanaian Cedi', ZAR: 'South African Rand',
  KES: 'Kenyan Shilling', AUD: 'Australian Dollar', JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee',
}

function CurrencyConverter() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('NGN')

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await res.json()
        setRates(data.rates)
      } catch {
        setError('Could not load exchange rates. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchRates()
  }, [])

  const result = useMemo(() => {
    if (!rates) return ''
    const value = parseFloat(amount)
    if (isNaN(value)) return ''
    const usdAmount = value / rates[from]
    const converted = usdAmount * rates[to]
    return converted.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }, [amount, from, to, rates])

  const rate = useMemo(() => {
    if (!rates) return null
    return (rates[to] / rates[from]).toFixed(4)
  }, [rates, from, to])

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      <div className="bg-[#0a0f2c] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/tech-hub"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tech Hub
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <DollarSign size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Currency Converter</h1>
              <p className="text-gray-400 text-sm">Live exchange rates, updated regularly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Fetching live rates...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-semibold text-sm rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && rates && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-800 mb-4 focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-end gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">From</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                >
                  {Object.entries(CURRENCIES).map(([code, name]) => (
                    <option key={code} value={code}>{code} — {name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={swap}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors flex-shrink-0"
                title="Swap currencies"
              >
                <ArrowLeftRight size={16} />
              </button>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">To</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                >
                  {Object.entries(CURRENCIES).map(([code, name]) => (
                    <option key={code} value={code}>{code} — {name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <p className="text-3xl font-black text-amber-700 mb-1">
                {result} {to}
              </p>
              {rate && (
                <p className="text-amber-600 text-xs">
                  1 {from} = {rate} {to}
                </p>
              )}
            </div>

          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-6">
          Rates provided by a free exchange rate API — for reference, not for large transactions.
        </p>
      </div>

    </div>
  )
}

export default CurrencyConverter
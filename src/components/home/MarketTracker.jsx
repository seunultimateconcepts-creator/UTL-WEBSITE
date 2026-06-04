import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function MarketTracker() {
  const navigate = useNavigate()

  const [cryptos, setCryptos] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&sparkline=false'
      )
      const data = await res.json()
      setCryptos(data)
    } catch {
      setError('Failed to load crypto data')
    }

    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      const data = await res.json()
      const r = data.rates
      const ngn = r.NGN
      setCurrencies([
        { pair: 'USD/NGN', rate: ngn.toFixed(2),           flag: '🇺🇸', name: 'US Dollar' },
        { pair: 'GBP/NGN', rate: (ngn / r.GBP).toFixed(2), flag: '🇬🇧', name: 'British Pound' },
        { pair: 'EUR/NGN', rate: (ngn / r.EUR).toFixed(2),  flag: '🇪🇺', name: 'Euro' },
        { pair: 'CAD/NGN', rate: (ngn / r.CAD).toFixed(2),  flag: '🇨🇦', name: 'Canadian Dollar' },
      ])
    } catch {
      setError('Failed to load currency data')
    }

    setLastUpdated(new Date().toLocaleTimeString())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 60000)
    return () => clearInterval(interval)
  }, [fetchAll])

  // ✅ Check if logged in for full tracker link
  const handleViewFull = () => {
    const user = localStorage.getItem('utl_current_user')
    if (!user) {
      localStorage.setItem('utl_redirect_after_login', '/services/crypto')
      navigate('/signup')
    } else {
      navigate('/services/crypto')
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">LIVE DATA</p>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Mini Market Tracker</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Real-time crypto prices and currency rates — updated every 60 seconds.
          </p>
          {lastUpdated && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-gray-400 text-xs">Last updated: {lastUpdated}</span>
              <button onClick={fetchAll} className="text-blue-600 text-xs font-semibold hover:text-blue-700">
                🔄 Refresh
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Fetching live market data...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button onClick={fetchAll} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
              Try Again
            </button>
          </div>
        )}

        {/* Live Data — visible to everyone */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-8">

            {/* Crypto Prices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <h3 className="text-gray-900 font-bold">Crypto Prices</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-500 text-xs font-semibold">LIVE</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {cryptos.map((coin) => (
                  <div key={coin.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-gray-900 text-sm font-semibold">{coin.name}</p>
                        <p className="text-gray-400 text-xs uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 text-sm font-bold">
                        ${coin.current_price.toLocaleString()}
                      </p>
                      <p className={`text-xs font-semibold ${
                        coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Rates */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💵</span>
                  <h3 className="text-gray-900 font-bold">Currency Rates</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-500 text-xs font-semibold">LIVE</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {currencies.map((currency) => (
                  <div key={currency.pair}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <p className="text-gray-900 text-sm font-semibold">{currency.pair}</p>
                        <p className="text-gray-400 text-xs">{currency.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 text-sm font-bold">
                        ₦{Number(currency.rate).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-xs">per 1 unit</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                <p className="text-blue-600 text-xs">💡 Contact us for best P2P rates.</p>
              </div>
            </div>

          </div>
        )}

        {/* View Full Tracker — requires login */}
        <div className="text-center mt-10">
          <button
            onClick={handleViewFull}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
          >
            View Full Market Tracker →
          </button>
          <p className="text-gray-400 text-xs mt-2">
            Sign up for free to access live charts, top 10 coins and more!
          </p>
        </div>

      </div>
    </section>
  )
}

export default MarketTracker
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Coins, Handshake, GraduationCap, Zap, ShieldCheck, Gem, Phone,
  RefreshCw, TrendingUp, Wallet, AlertTriangle, Lightbulb, ArrowRight,
} from 'lucide-react'

// ✅ Outside the main function — React rule!
const TradingViewChart = ({ symbol, title }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h3 className="text-gray-900 font-bold text-sm">{title}</h3>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-500 text-xs font-semibold">LIVE</span>
      </div>
    </div>
    <div style={{ height: '280px' }}>
      <iframe
        src={`https://s.tradingview.com/widgetembed/?frameElementId=${symbol}&symbol=BINANCE:${symbol}&interval=D&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=1&saveimage=0&toolbarbg=f8f9fa&studies=[]&theme=light&style=1&timezone=Africa%2FLagos&withdateranges=1`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title={title}
      />
    </div>
  </div>
)

function CryptoServices() {

  const [cryptos, setCryptos]       = useState([])
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading]       = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTab, setActiveTab]   = useState('prices')

  const services = [
    { icon: Coins, title: 'Buy & Sell Crypto', desc: 'Buy or sell Bitcoin, Ethereum, USDT and more at the best market rates. Fast, safe and reliable.', features: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'USDT', 'BNB', 'Solana (SOL)', 'Litecoin (LTC)'] },
    { icon: Handshake, title: 'P2P Trading', desc: 'Trade directly with a trusted partner at better rates than any exchange. No hidden fees.', features: ['Best rates guaranteed', 'Fast settlement', 'Secure transactions', 'Multiple payment methods'] },
    { icon: GraduationCap, title: 'Crypto Mentorship', desc: 'New to crypto? We guide you from zero to confident trader with practical hands-on training.', features: ['Chart reading', 'Trading strategies', 'Risk management', 'Market analysis'] },
  ]

  const whyUs = [
    { icon: Zap, title: 'Fast Transactions', desc: 'We process all trades quickly.' },
    { icon: ShieldCheck, title: 'Secure & Safe', desc: 'Your funds are always protected.' },
    { icon: Gem, title: 'Best Rates', desc: 'Competitive market rates always.' },
    { icon: Phone, title: '24/7 Support', desc: 'Always available to assist you.' },
  ]

  const charts = [
    { symbol: 'BTCUSDT', title: 'Bitcoin / USDT' },
    { symbol: 'ETHUSDT', title: 'Ethereum / USDT' },
    { symbol: 'SOLUSDT', title: 'Solana / USDT' },
    { symbol: 'BNBUSDT', title: 'BNB / USDT' },
  ]

  const tabs = [
    { id: 'prices', label: 'Crypto Prices', icon: Coins },
    { id: 'currencies', label: 'Currency Rates', icon: Wallet },
    { id: 'charts', label: 'Live Charts', icon: TrendingUp },
  ]

  const fetchAll = useCallback(async () => {
    setLoading(true)

    // Fetch crypto prices
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana,litecoin,ripple,cardano,dogecoin,polkadot&order=market_cap_desc&sparkline=false'
      )
      const data = await res.json()
      setCryptos(data)
    } catch (err) {
      console.error('Crypto error:', err)
    }

    // Fetch currency rates
    try {
      const res  = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      const data = await res.json()
      const r    = data.rates
      const ngn  = r.NGN
      setCurrencies([
        { pair: 'USD/NGN', rate: ngn.toFixed(2),            flag: '🇺🇸', name: 'US Dollar' },
        { pair: 'GBP/NGN', rate: (ngn / r.GBP).toFixed(2), flag: '🇬🇧', name: 'British Pound' },
        { pair: 'EUR/NGN', rate: (ngn / r.EUR).toFixed(2),  flag: '🇪🇺', name: 'Euro' },
        { pair: 'CAD/NGN', rate: (ngn / r.CAD).toFixed(2),  flag: '🇨🇦', name: 'Canadian Dollar' },
        { pair: 'AED/NGN', rate: (ngn / r.AED).toFixed(2),  flag: '🇦🇪', name: 'UAE Dirham' },
        { pair: 'CNY/NGN', rate: (ngn / r.CNY).toFixed(2),  flag: '🇨🇳', name: 'Chinese Yuan' },
      ])
    } catch (err) {
      console.error('Currency error:', err)
    }

    setLastUpdated(new Date().toLocaleTimeString())
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line
    fetchAll()
    const interval = setInterval(fetchAll, 60000)
    return () => clearInterval(interval)
  }, [fetchAll])

  return (
    <div className="pt-16">

      {/* ── Hero ── */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>›</span>
            <span className="text-green-400">Crypto Services</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-500/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-xs font-medium tracking-wide">CRYPTO SERVICES</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Trade Crypto{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  Safely & Profitably
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Buy, sell and trade cryptocurrencies at the best rates. We mentor beginners to become confident and profitable traders.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  Start Trading →
                </a>
                <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  Get Mentorship
                </a>
              </div>
            </div>

            {/* Right — coin cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '₿', label: 'Bitcoin',  ticker: 'BTC',  color: 'text-yellow-400' },
                { icon: 'Ξ', label: 'Ethereum', ticker: 'ETH',  color: 'text-purple-400' },
                { icon: '₮', label: 'Tether',   ticker: 'USDT', color: 'text-green-400'  },
                { icon: '◎', label: 'Solana',   ticker: 'SOL',  color: 'text-blue-400'   },
              ].map((coin) => (
                <div key={coin.ticker}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                  <span className={`text-3xl font-black block mb-1 ${coin.color}`}>{coin.icon}</span>
                  <p className="text-white font-bold text-sm">{coin.label}</p>
                  <p className="text-gray-400 text-xs">{coin.ticker}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-green-600 text-sm font-semibold tracking-widest uppercase mb-3">WHAT WE OFFER</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Crypto Services</h2>
            <p className="text-gray-500 max-w-md mx-auto">Everything you need to succeed in the crypto market.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <service.icon size={22} className="text-green-600" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Tracker ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-green-600 text-sm font-semibold tracking-widest uppercase mb-3">LIVE DATA</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Full Market Tracker</h2>
            <p className="text-gray-500 max-w-md mx-auto">Real-time prices, currency rates and live trading charts.</p>
            {lastUpdated && (
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-gray-400 text-xs">Updated: {lastUpdated}</span>
                <button onClick={fetchAll} className="flex items-center gap-1 text-green-600 text-xs font-semibold hover:text-green-700">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                <tab.icon size={15} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Loading spinner */}
          {loading && activeTab !== 'charts' && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Fetching live data...</p>
            </div>
          )}

          {/* Crypto Prices */}
          {activeTab === 'prices' && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Coins size={18} className="text-green-600" />
                  <h3 className="text-gray-900 font-bold">Top 10 Crypto Prices</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-500 text-xs font-semibold">LIVE</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {cryptos.map((coin, index) => (
                  <div key={coin.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-xs w-5 text-right">{index + 1}</span>
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
          )}

          {/* Currency Rates */}
          {activeTab === 'currencies' && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-green-600" />
                  <h3 className="text-gray-900 font-bold">Currency Rates to NGN</h3>
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
              <div className="px-6 py-4 bg-green-50 border-t border-green-100">
                <p className="flex items-center gap-1.5 text-green-600 text-xs">
                  <Lightbulb size={13} /> Contact us on WhatsApp for best P2P rates
                </p>
              </div>
            </div>
          )}

          {/* Live Charts */}
          {activeTab === 'charts' && (
            <div className="grid md:grid-cols-2 gap-6">
              {charts.map((chart) => (
                <TradingViewChart
                  key={chart.symbol}
                  symbol={chart.symbol}
                  title={chart.title}
                />
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-2xl p-5 max-w-2xl mx-auto">
            <p className="flex items-center gap-1.5 text-yellow-700 text-xs font-semibold mb-1">
              <AlertTriangle size={13} /> Disclaimer
            </p>
            <p className="text-yellow-600 text-xs leading-relaxed">
              Crypto trading involves risk. Always do your own research (DYOR) before investing.
              Never invest more than you can afford to lose. UTL is not a licensed financial advisor.
            </p>
          </div>

        </div>
      </section>

      {/* ── Why Trade With Us ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-green-600 text-sm font-semibold tracking-widest uppercase mb-3">WHY CHOOSE US</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Why Trade With UTL?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {whyUs.map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                  <item.icon size={26} className="text-green-600" />
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to start trading?
          </h2>
          <p className="text-gray-400 mb-8">
            Contact us on WhatsApp and let's get you started today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.054 23.447a.5.5 0 0 0 .609.61l5.704-1.49A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.009-1.374l-.36-.213-3.726.973.997-3.634-.234-.374A9.818 9.818 0 1 1 12 21.818z"/>
              </svg>
              Start Trading on WhatsApp
            </a>
            <Link to="/contact"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default CryptoServices
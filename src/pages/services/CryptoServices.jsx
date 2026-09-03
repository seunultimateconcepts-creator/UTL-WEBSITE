/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Coins, GraduationCap, Zap, ShieldCheck, Gem, Phone,
  RefreshCw, TrendingUp, Wallet, AlertTriangle, Lightbulb, PlayCircle, Calendar,
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

// ✅ Free educational videos — unlisted YouTube embeds, zero hosting
// cost. These are placeholder/test video IDs (distinct, real, publicly
// available) so the grid can actually be tested with 4 different
// embeds — swap every id for your real uploaded videos before launch.
const EDUCATIONAL_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Getting Started: Setting Up Your First Exchange Account' },
  { id: 'jNQXAC9IVRw', title: 'Reading a Candlestick Chart — The Basics' },
  { id: '9bZkp7q19f0', title: 'Common Beginner Mistakes to Avoid' },
  { id: 'M7lc1UVf-VE', title: 'Understanding Risk Management' },
]

function CryptoServices() {

  const [cryptos, setCryptos]       = useState([])
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading]       = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTab, setActiveTab]   = useState('prices')

  // ✅ REMOVED: "Buy & Sell Crypto" and "P2P Trading" — both were
  // direct trading-facilitation services, which is exactly what's
  // ruled out given the SEC capital requirements (₦2bn+ for
  // exchanges/custodians). Crypto Mentorship stays — pure education,
  // zero regulatory exposure, and now genuinely bookable instead of
  // dead-ending at WhatsApp.
  const services = [
    { icon: GraduationCap, title: 'Crypto Mentorship', desc: 'New to crypto? We guide you from zero to confident, informed trader with practical hands-on training — you make every trade yourself, on your own exchange account.', features: ['Chart reading', 'Trading strategies', 'Risk management', 'Market analysis'] },
    { icon: PlayCircle, title: 'Free Video Library', desc: 'Learn the fundamentals at your own pace before booking a live session.', features: ['Account setup walkthroughs', 'Chart reading basics', 'Common beginner mistakes', 'Always free'] },
    { icon: TrendingUp, title: 'Live Market Data', desc: 'Real-time prices, currency rates and live charts — completely free, no account needed.', features: ['Top 10 crypto prices', 'NGN exchange rates', 'Live TradingView charts', 'Updates every 60 seconds'] },
  ]

  const whyUs = [
    { icon: Zap, title: 'Real Mentorship', desc: 'Hands-on, practical guidance — not generic courses.' },
    { icon: ShieldCheck, title: 'Zero Trading Risk From Us', desc: 'We never touch your funds or execute trades on your behalf.' },
    { icon: Gem, title: 'Free Foundations', desc: 'Learn the basics at no cost before you ever pay for anything.' },
    { icon: Phone, title: 'Real Support', desc: 'Message us directly with questions once you\'re a client.' },
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
                <span className="text-green-300 text-xs font-medium tracking-wide">CRYPTO EDUCATION & MARKET DATA</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Learn Crypto{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  The Right Way
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Free market data, free educational videos, and real hands-on mentorship — we teach you
                to trade confidently on your own account. We never execute trades or hold funds on your behalf.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book-service"
                  className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  Book Mentorship →
                </Link>
                <a href="#videos"
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  Watch Free Videos
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
            <p className="text-gray-500 max-w-md mx-auto">Education and market data — never trade execution.</p>
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

      {/* ── Free Video Library ── */}
      <section id="videos" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-green-600 text-sm font-semibold tracking-widest uppercase mb-3">FREE, ALWAYS</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Learn the Basics First</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Start here — free videos covering the fundamentals before you ever need to book anything.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {EDUCATIONAL_VIDEOS.map((video) => (
              <div key={video.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-900 font-semibold text-sm">{video.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/book-service"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              <Calendar size={18} /> Ready for 1-on-1? Book Mentorship
            </Link>
          </div>
        </div>
      </section>

      {/* ── Market Tracker ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-green-600 text-sm font-semibold tracking-widest uppercase mb-3">LIVE DATA</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Full Market Tracker</h2>
            <p className="text-gray-500 max-w-md mx-auto">Real-time prices, currency rates and live trading charts — free, no account needed.</p>
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
              This page is for information and education only. UTL does not execute trades, hold funds,
              or act as an exchange or broker on your behalf. Crypto trading involves real risk — always
              do your own research (DYOR) and never invest more than you can afford to lose. UTL is not
              a licensed financial advisor.
            </p>
          </div>

        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-green-600 text-sm font-semibold tracking-widest uppercase mb-3">WHY CHOOSE US</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Why Learn With UTL?</h2>
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
            Ready to learn?
          </h2>
          <p className="text-gray-400 mb-8">
            Book a mentorship session, or start with the free videos above.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book-service"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              <Calendar size={18} /> Book Mentorship
            </Link>
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
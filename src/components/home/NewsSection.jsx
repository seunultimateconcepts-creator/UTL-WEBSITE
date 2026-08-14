/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Laptop, Landmark, ArrowRight, RefreshCw } from 'lucide-react'

// ✅ Same base URL pattern used in services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function NewsSection() {
  const [activeTab, setActiveTab] = useState('crypto')
  const [newsByTab, setNewsByTab] = useState({}) // cache per tab so switching back doesn't refetch
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'crypto',  label: 'Crypto News',  icon: TrendingUp },
    { id: 'tech',    label: 'Tech News',    icon: Laptop },
    { id: 'nigeria', label: 'Nigeria Tech', icon: Landmark },
  ]

  const fetchNews = useCallback(async (category, force = false) => {
    // ✅ Already have this tab's data and not forcing a refresh — skip the call
    if (!force && newsByTab[category]) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BASE_URL}/news/${category}`)
      const data = await res.json()

      if (!data.success) throw new Error(data.message || 'Failed to load news')

      setNewsByTab((prev) => ({ ...prev, [category]: data.articles }))
    } catch {
      setError('Unable to load news right now.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchNews(activeTab)
  }, [activeTab, fetchNews])

  const currentNews = newsByTab[activeTab] || []

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
            LATEST UPDATES
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            News & Headlines
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Stay informed with the latest in crypto, tech and Nigerian business news.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0a0f2c] text-white shadow-lg shadow-amber-500/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <TabIcon size={16} className={activeTab === tab.id ? 'text-amber-400' : ''} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Fetching latest headlines...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={() => fetchNews(activeTab, true)}
              className="flex items-center gap-1.5 mx-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-semibold text-sm rounded-xl"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && currentNews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentNews.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 p-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-amber-200 rounded-2xl hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-600 font-black text-sm">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                      {item.category}
                    </span>
                    <span className="text-gray-400 text-[10px]">{item.time}</span>
                  </div>
                  <p className="text-gray-800 text-sm font-semibold leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </p>
                  <p className="text-gray-400 text-xs">{item.source}</p>
                </div>

                <div className="flex-shrink-0 text-gray-300 group-hover:text-amber-500 transition-colors mt-1">
                  <ArrowRight size={16} />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty state — no articles returned but no error either */}
        {!loading && !error && currentNews.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No headlines available right now.</p>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            Live headlines • Click any story to read the full article
          </p>
        </div>

      </div>
    </section>
  )
}

export default NewsSection
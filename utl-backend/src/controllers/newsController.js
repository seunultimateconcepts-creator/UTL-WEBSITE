/* eslint-disable no-undef */

// ✅ Simple in-memory cache — shared across all visitors, so 100
// people loading the homepage in the same 20 minutes only costs
// ONE real API call, not 100. Resets when the server restarts.
const cache = {}
const CACHE_DURATION = 20 * 60 * 1000 // 20 minutes

// ✅ Search query + filters for each tab. Tweak these queries anytime
// to change what shows up — no other code needs to change.
const CATEGORY_CONFIG = {
  crypto: {
    query: 'bitcoin OR cryptocurrency OR ethereum OR crypto',
  },
  tech: {
    query: 'technology',
    category: 'technology',
  },
  nigeria: {
    query: 'nigeria technology OR nigeria startup OR nigeria tech',
    country: 'ng',
  },
}

// ✅ Rotating badge colors — since real articles don't come pre-tagged
// with a category color like the old dummy data did, we just cycle
// through a palette so the grid still looks visually varied.
const BADGE_COLORS = [
  'bg-orange-100 text-orange-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-teal-100 text-teal-700',
  'bg-gray-100 text-gray-700',
]

// ✅ Turns "2026-08-14 10:30:00" into "2h ago"
function timeAgo(pubDate) {
  const then = new Date(pubDate.replace(' ', 'T') + 'Z')
  const now = new Date()
  const diffMs = now - then
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHrs < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)))
    return `${diffMins}m ago`
  }
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

const getNews = async (req, res) => {
  try {
    const { category } = req.params
    const config = CATEGORY_CONFIG[category]

    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Use crypto, tech, or nigeria.',
      })
    }

    // ✅ Serve from cache if it's still fresh
    const cached = cache[category]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.status(200).json({ success: true, articles: cached.data, cached: true })
    }

    // ✅ Build the NewsData.io request
    const params = new URLSearchParams({
      apikey: process.env.NEWSDATA_API_KEY,
      q: config.query,
      language: 'en',
      size: '6',
    })
    if (config.category) params.append('category', config.category)
    if (config.country) params.append('country', config.country)

    const response = await fetch(`https://newsdata.io/api/1/latest?${params.toString()}`)
    const data = await response.json()

    if (data.status !== 'success') {
      throw new Error(data.results?.message || 'NewsData.io request failed')
    }

    // ✅ Reshape into exactly what the frontend expects
    const articles = (data.results || []).slice(0, 6).map((item, index) => ({
      title: item.title,
      source: item.source_name || item.source_id || 'Unknown source',
      time: item.pubDate ? timeAgo(item.pubDate) : '',
      url: item.link,
      category: item.category?.[0]
        ? item.category[0].charAt(0).toUpperCase() + item.category[0].slice(1)
        : 'News',
      color: BADGE_COLORS[index % BADGE_COLORS.length],
    }))

    cache[category] = { data: articles, timestamp: Date.now() }

    res.status(200).json({ success: true, articles, cached: false })
  } catch (error) {
    console.error('News fetch failed:', error.message)

    // ✅ If we have ANY cached data, even stale, serve that instead
    // of showing an empty state — better degraded experience.
    const stale = cache[req.params.category]
    if (stale) {
      return res.status(200).json({ success: true, articles: stale.data, cached: true, stale: true })
    }

    res.status(500).json({
      success: false,
      message: 'Unable to fetch news right now',
      error: error.message,
    })
  }
}

module.exports = { getNews }
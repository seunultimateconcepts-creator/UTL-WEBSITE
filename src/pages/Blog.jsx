import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthGuard from '../hooks/useAuthGuard'
import {
  Star, PenLine, Calendar, Clock, Lock, Search, Mail, ArrowRight,
} from 'lucide-react'

function Blog() {
  const { requireAuth, isLoggedIn } = useAuthGuard()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // ✅ Blog categories
  const categories = ['All', 'Web Development', 'Crypto', 'Tech News', 'Tutorials', 'Business']

  // ✅ Blog posts — add real posts here as you write them
  const posts = [
    {
      id: 1,
      title: 'How to Build a Modern Website in 2026',
      category: 'Web Development',
      excerpt: 'A complete guide to building fast, scalable and beautiful websites using React, Vite and Tailwind CSS.',
      date: 'May 15, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&q=80',
      author: 'Oluwaseun',
      featured: true,
      tags: ['React', 'Vite', 'Tailwind'],
    },
    {
      id: 2,
      title: 'Understanding P2P Crypto Trading in Nigeria',
      category: 'Crypto',
      excerpt: 'Everything you need to know about peer-to-peer crypto trading — how it works, best rates and how to stay safe.',
      date: 'May 10, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=600&q=80',
      author: 'Oluwaseun',
      featured: true,
      tags: ['Crypto', 'P2P', 'Nigeria'],
    },
    {
      id: 3,
      title: 'Top 10 Tech Tools Every Developer Should Know in 2026',
      category: 'Tech News',
      excerpt: 'From AI coding assistants to deployment platforms — these are the tools that are changing how developers work.',
      date: 'May 5, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
      author: 'Oluwaseun',
      featured: false,
      tags: ['Tools', 'Productivity', 'AI'],
    },
    {
      id: 4,
      title: 'How to Start Freelancing as a Web Developer in Nigeria',
      category: 'Business',
      excerpt: 'A practical guide to landing your first freelance client, setting your rates and building a sustainable income.',
      date: 'April 28, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
      author: 'Oluwaseun',
      featured: false,
      tags: ['Freelance', 'Business', 'Nigeria'],
    },
    {
      id: 5,
      title: 'Bitcoin vs Ethereum — Which Should You Invest In?',
      category: 'Crypto',
      excerpt: 'A deep dive into the two biggest cryptocurrencies — comparing their technology, use cases and investment potential.',
      date: 'April 20, 2026',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80',
      author: 'Oluwaseun',
      featured: false,
      tags: ['Bitcoin', 'Ethereum', 'Investing'],
    },
    {
      id: 6,
      title: 'Building Your First React App — A Beginner\'s Guide',
      category: 'Tutorials',
      excerpt: 'Step by step guide to creating your first React application from scratch — perfect for complete beginners.',
      date: 'April 15, 2026',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
      author: 'Oluwaseun',
      featured: false,
      tags: ['React', 'Beginner', 'Tutorial'],
    },
  ]

  // ✅ Filter posts by category and search
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // ✅ Featured posts
  const featuredPosts = posts.filter(p => p.featured)

  // ✅ Category colors — kept distinct per category, these encode information
  const categoryColors = {
    'Web Development': 'bg-blue-100 text-blue-700',
    'Crypto': 'bg-green-100 text-green-700',
    'Tech News': 'bg-purple-100 text-purple-700',
    'Tutorials': 'bg-orange-100 text-orange-700',
    'Business': 'bg-pink-100 text-pink-700',
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-amber-400">Blog</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 text-xs font-medium tracking-wide">UTL BLOG</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Insights on Tech,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                Crypto & Business
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Stay updated with the latest in web development, crypto trading, tech tools and business tips from the UTL team.
            </p>

            {/* Search bar */}
            <div className="flex gap-3 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="flex items-center gap-2 text-2xl font-black text-gray-900">
              <Star size={22} className="text-amber-500" fill="currentColor" /> Featured Articles
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <div key={post.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-[#0a0f2c] text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <Star size={11} fill="currentColor" /> Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                    <span className="flex items-center gap-1"><PenLine size={12} /> {post.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 className="text-gray-900 font-black text-xl mb-3 group-hover:text-amber-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const user = localStorage.getItem('utl_current_user')
                        if (!user) {
                          localStorage.setItem('utl_redirect_after_login', '/blog')
                          window.location.href = '/signup'
                        } else {
                          alert('Full blog coming soon!')
                        }
                      }}
                      className="flex items-center gap-1 text-amber-600 text-xs font-bold hover:text-amber-700 cursor-pointer"
                    >
                      {localStorage.getItem('utl_current_user') ? (
                        <>Read More <ArrowRight size={12} /></>
                      ) : (
                        <><Lock size={12} /> Sign up to Read</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-[#0a0f2c] shadow-lg shadow-amber-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-gray-500 text-sm mb-6">
            Showing <span className="font-semibold text-gray-900">{filteredPosts.length}</span> articles
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* No results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Search size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-900 font-bold mb-2">No articles found</p>
              <p className="text-gray-500 text-sm">Try a different search or category</p>
              <button onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                className="mt-4 px-4 py-2 bg-amber-500 text-[#0a0f2c] text-sm font-semibold rounded-xl">
                Clear Filters
              </button>
            </div>
          )}

          {/* Posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-base mb-2 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#0a0f2c] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        O
                      </div>
                      <span className="text-gray-500 text-xs">{post.author}</span>
                    </div>
                    <button
                      onClick={() => requireAuth()}
                      className="flex items-center gap-1 text-amber-600 text-xs font-bold hover:text-amber-700"
                    >
                      {isLoggedIn() ? (
                        <>Read <ArrowRight size={12} /></>
                      ) : (
                        <><Lock size={12} /> Sign up to Read</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0a0f2c] rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="flex items-center justify-center gap-2 text-2xl font-black text-white mb-2">
                <Mail size={22} className="text-amber-400" /> Never Miss an Article
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Subscribe to get our latest articles on tech, crypto and business straight to your inbox.
              </p>
              <div className="flex gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Blog
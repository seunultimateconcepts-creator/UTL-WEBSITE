import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, ShoppingBag, Store, ArrowRight, Sparkles, Plus, Info,
} from 'lucide-react'

function Shop() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const flashMessage = location.state?.message

  // ✅ Vendors — Ultimate Shop is live (UTL's own shopping-assistant service,
  // fills the marketplace while real sellers onboard). Everything after it
  // is a placeholder slot until a seller application is approved.
  // When a seller goes live, replace a placeholder object with:
  // { id, name, tagline, path: `/shop/${slug}`, status: 'live' }
  const vendors = [
    {
      id: 'utl-shop',
      name: 'Ultimate Shop',
      tagline: 'Where all shopping becomes easy — order from Jumia, Amazon, AliExpress and more, delivered to you.',
      path: '/shop/ultimate',
      status: 'live',
    },
    { id: 'slot-2', name: 'Next Vendor', status: 'coming-soon' },
    { id: 'slot-3', name: 'Next Vendor', status: 'coming-soon' },
    { id: 'slot-4', name: 'Next Vendor', status: 'coming-soon' },
    { id: 'slot-5', name: 'Next Vendor', status: 'coming-soon' },
    { id: 'slot-6', name: 'Next Vendor', status: 'coming-soon' },
  ]

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <Store size={13} className="text-orange-300" />
            <span className="text-orange-300 text-xs font-medium tracking-wide">U MARKET</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            One Marketplace,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Every Vendor
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Browse trusted vendors on Ultimate Tech Lab. We're onboarding sellers now — Ultimate Shop is live today, more vendors joining soon.
          </p>

          {/* Search + Become a Vendor */}
          <div className="flex flex-wrap max-w-xl mx-auto gap-3 justify-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <Link
              to="/become-seller"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              <Store size={16} /> Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Flash message (e.g. redirected here from a locked dashboard) */}
      {flashMessage && (
        <div className="bg-amber-50 border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
            <Info size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm font-medium">{flashMessage}</p>
          </div>
        </div>
      )}

      {/* Vendor Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm">
              <span className="text-gray-900 font-semibold">{filteredVendors.length}</span> vendor slot{filteredVendors.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) =>
              vendor.status === 'live' ? (
                <Link
                  key={vendor.id}
                  to={vendor.path}
                  className="group relative bg-white border-2 border-orange-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Live badge */}
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <Sparkles size={11} /> Live
                  </span>

                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                    <ShoppingBag size={30} className="text-orange-600" />
                  </div>
                  <h3 className="text-gray-900 font-black text-2xl mb-2">{vendor.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{vendor.tagline}</p>
                  <span className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm group-hover:gap-3 transition-all">
                    Visit Store <ArrowRight size={16} />
                  </span>
                </Link>
              ) : (
                <Link
                  key={vendor.id}
                  to="/become-seller"
                  className="group flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-300 min-h-[260px]"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-50 transition-colors">
                    <Plus size={24} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <h3 className="text-gray-400 font-bold text-base mb-1 group-hover:text-gray-600 transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-gray-300 text-xs mb-4 group-hover:text-amber-600 transition-colors">
                    This slot is open
                  </p>
                  <span className="text-xs font-semibold text-gray-400 group-hover:text-amber-600 transition-colors">
                    Apply to sell here →
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Have a business? Sell on U Market.
          </h2>
          <p className="text-gray-400 mb-8">
            Get one of these vendor slots before they're gone. Setup takes less than 24 hours.
          </p>
          <Link
            to="/become-seller"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            <Store size={18} /> Become a Vendor
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Shop
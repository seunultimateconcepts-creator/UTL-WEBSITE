import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, ShoppingCart, Monitor, Coins, ArrowRight, Send,
} from 'lucide-react'
import ShareLink from '../components/ShareLink'
import CartDrawer from '../components/CartDrawer'
import SourcingRequestItemForm from '../components/SourcingRequestItemForm'
import { useCart } from '../context/CartContext'

// ✅ Sourcing cards — creates a request, no fixed catalog, no stock
// sync problem, since nothing here claims to have a specific item in
// stock. This IS what Ultimate Concepts actually does: source things
// on request, not sell from a fixed shelf.
const SOURCING_PLATFORMS = [
  { name: 'Jumia', color: 'bg-orange-500' },
  { name: 'Jiji', color: 'bg-green-600' },
  { name: 'Temu', color: 'bg-orange-600' },
  { name: 'AliExpress', color: 'bg-red-500' },
  { name: 'CDCare', color: 'bg-blue-600' },
  { name: 'Amazon', color: 'bg-yellow-600' },
  { name: 'eBay', color: 'bg-purple-600' },
]

// ✅ These are NOT sourcing requests — clicking one just sends the
// customer straight to the real service page, no order/request created
// here at all.
const UTL_SERVICES = [
  { name: 'Web Development', path: '/services/web-development', icon: Monitor },
  { name: 'Crypto Services', path: '/services/crypto', icon: Coins },
]

function UltimateConcepts() {
  const { addItem, cartCount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [activePlatform, setActivePlatform] = useState(null) // opens the request form modal
  const [justAdded, setJustAdded] = useState(null)

  const handleAddRequest = (item) => {
    addItem(item)
    setActivePlatform(null)
    setJustAdded(item.platform)
    setTimeout(() => setJustAdded(null), 1500)
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/shop" className="hover:text-white transition-colors">U-Come</Link>
              <span>›</span>
              <span className="text-orange-400">Ultimate Concepts</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <ShoppingBag size={13} className="text-orange-300" />
            <span className="text-orange-300 text-xs font-medium tracking-wide">ULTIMATE CONCEPTS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Tell Us What You Want,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              We'll Get It
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Request anything from Jumia, Jiji, Temu, AliExpress, CDCare, Amazon or eBay — we source it,
            confirm the price, and get it to you. No account needed on any of those platforms, just tell us.
          </p>
        </div>
      </section>

      {/* Sourcing Platforms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">REQUEST SOURCING</p>
            <h2 className="text-3xl font-black text-gray-900">Where should we shop for you?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {SOURCING_PLATFORMS.map((platform) => (
              <button
                key={platform.name}
                onClick={() => setActivePlatform(platform.name)}
                className="group bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-3 h-3 rounded-full ${platform.color} mx-auto mb-3`} />
                <p className="text-gray-900 font-bold text-sm mb-3">{platform.name}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-bold rounded-lg px-3 py-1.5 transition-colors ${
                  justAdded === platform.name
                    ? 'bg-green-500 text-white'
                    : 'bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                }`}>
                  {justAdded === platform.name ? 'Added ✓' : (
                    <><ShoppingCart size={12} /> Add to Cart</>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* UTL Services — redirect, no request created */}
          <div className="text-center mb-8">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">UTL SERVICES</p>
            <h2 className="text-2xl font-black text-gray-900">Looking for something else?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {UTL_SERVICES.map((service) => (
              <Link
                key={service.name}
                to={service.path}
                className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <service.icon size={22} className="text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-bold text-sm">{service.name}</p>
                  <p className="text-gray-400 text-xs">Go to service page</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Send size={18} className="text-orange-600" />
            </div>
            <p className="text-gray-900 font-bold text-sm mb-1">1. Send Request</p>
            <p className="text-gray-500 text-xs">Add what you want, submit — no price needed upfront</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={18} className="text-orange-600" />
            </div>
            <p className="text-gray-900 font-bold text-sm mb-1">2. We Source It</p>
            <p className="text-gray-500 text-xs">We confirm price and place the actual order</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShoppingCart size={18} className="text-orange-600" />
            </div>
            <p className="text-gray-900 font-bold text-sm mb-1">3. Track & Collect</p>
            <p className="text-gray-500 text-xs">Track it in your dashboard, we arrange pickup or delivery</p>
          </div>
        </div>
      </section>

      {/* Sticky cart + share — bottom-LEFT specifically, since the
          site's global chat widget already occupies bottom-right and
          was silently swallowing the cart button underneath it */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col items-start gap-3">
        <ShareLink
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title="Ultimate Concepts on U-Come"
          className="!shadow-lg"
        />
        <button
          onClick={() => setCartOpen(true)}
          className="relative w-14 h-14 flex items-center justify-center bg-orange-500 hover:bg-orange-400 rounded-full text-white shadow-lg transition-colors"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-[#0a0f2c] text-white text-xs font-bold rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Request form modal */}
      {activePlatform && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <SourcingRequestItemForm
              platform={activePlatform}
              onAdd={handleAddRequest}
              onCancel={() => setActivePlatform(null)}
            />
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

    </div>
  )
}

export default UltimateConcepts
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo_utl.png'
import { getDashboardConfig } from '../../config/dashboardConfig'
import {
  LayoutDashboard, Briefcase, ShoppingCart, Store, MessageCircle,
  Settings, Bell, Plus, FileText, Palette, Home, LogOut, User, Lock,
  Trash2, CheckCircle2, Clock,
} from 'lucide-react'
import ShareLink from '../../components/ShareLink'

// ✅ Maps the icon-name strings from dashboardConfig.js to actual
// lucide-react components. Add new icons here as needed.
const ICONS = {
  LayoutDashboard, Briefcase, ShoppingCart, Store, MessageCircle,
  Settings, Bell, Plus, FileText, Palette, Home, LogOut, User, Lock,
  Trash2, CheckCircle2, Clock,
}

// ✅ Small helper so we can write <Icon name="Briefcase" /> anywhere
function Icon({ name, className = 'w-5 h-5' }) {
  const Component = ICONS[name]
  if (!Component) return null
  return <Component className={className} />
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // ✅ Check login AND dashboard-unlock status.
  // Not logged in → /login. Logged in but hasn't placed an order yet →
  // /shop, with a message explaining why they landed there.
  useEffect(() => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(currentUser)

    if (!parsed.dashboardUnlocked) {
      navigate('/shop', {
        state: { message: 'Place your first order to unlock your dashboard!' },
      })
      return
    }

    // eslint-disable-next-line
    setUser(parsed)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('utl_token')
    localStorage.removeItem('utl_current_user')
    navigate('/')
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ✅ Seller is an UPGRADE, checked via sellerStatus — not a separate
  // accountType. Only an approved seller sees the seller dashboard.
  const isApprovedSeller = user.sellerStatus === 'approved'
  const config = getDashboardConfig(isApprovedSeller ? 'seller' : 'client')
  const { tabs, stats, quickActions } = config

  const validTabIds = tabs.map(t => t.id)
  const currentTab = validTabIds.includes(activeTab) ? activeTab : 'overview'

  const tabTitles = {
    overview: `Welcome back, ${user.firstName}!`,
    projects: 'My Projects',
    orders: 'My Orders',
    myshop: 'My Shop',
    messages: 'Messages',
    settings: 'Account Settings',
  }

  // ✅ Sidebar badge — shows seller status distinctly from plain client
  const roleLabel = isApprovedSeller
    ? 'Seller'
    : user.sellerStatus === 'pending'
      ? 'Seller application pending'
      : 'Client'

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0f2c] flex flex-col fixed h-full">

        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="UTL" className="h-10 w-auto rounded-lg" />
            <div>
              <div className="text-white font-black text-xs">ULTIMATE</div>
              <div className="text-amber-400 font-bold text-[10px] tracking-widest">TECH LAB</div>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-[#0a0f2c] font-bold text-sm flex-shrink-0">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{user.firstName} {user.lastName}</p>
              <p className={`text-xs flex items-center gap-1 ${user.sellerStatus === 'pending' ? 'text-amber-400' : 'text-gray-400'}`}>
                {user.sellerStatus === 'pending' && <Clock size={11} />}
                {roleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentTab === tab.id
                  ? 'bg-amber-500 text-[#0a0f2c]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
          >
            <Icon name="Home" className="w-4 h-4" /> Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-600 text-sm font-medium transition-all"
          >
            <Icon name="LogOut" className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {tabTitles[currentTab]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Icon name="Bell" className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-[#0a0f2c] font-bold text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </div>

        {/* Seller application pending banner */}
        {user.sellerStatus === 'pending' && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <Clock size={20} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
              Your seller application is under review. We'll unlock your seller dashboard within 24 hours.
            </p>
          </div>
        )}

        {/* Your store link — approved sellers only. This IS their live,
            shareable storefront the moment they've added at least one
            product — surfacing it here is what makes that actually
            useful instead of a URL only you know about. */}
        {isApprovedSeller && (
          <div className="mb-6 bg-white border border-orange-100 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-gray-900 font-bold text-sm mb-1">Your store is live</p>
              <p className="text-gray-500 text-xs break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/shop/vendor/${user.id}` : ''}
              </p>
            </div>
            <ShareLink
              url={typeof window !== 'undefined' ? `${window.location.origin}/shop/vendor/${user.id}` : ''}
              title={`${user.firstName}'s store on Ultimate Tech Lab`}
            />
          </div>
        )}

        {/* Overview Tab */}
        {currentTab === 'overview' && (
          <div className="space-y-8">

            {/* Stats */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                    <Icon name={stat.icon} className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  action.isTab ? (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.isTab)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors text-left ${action.color}`}
                    >
                      <Icon name={action.icon} className="w-5 h-5" />
                      <span className="text-sm font-semibold">{action.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={action.label}
                      to={action.link}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${action.color}`}
                    >
                      <Icon name={action.icon} className="w-5 h-5" />
                      <span className="text-sm font-semibold">{action.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Account info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone || '—' },
                  { label: 'Seller Status', value: isApprovedSeller ? 'Approved' : user.sellerStatus === 'pending' ? 'Pending review' : 'Not a seller' },
                  { label: 'Member Since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
                  { label: 'Account Status', value: 'Active' },
                ].map((info) => (
                  <div key={info.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">{info.label}</p>
                    <p className="text-gray-900 text-sm font-semibold flex items-center gap-1.5">
                      {info.label === 'Account Status' && <Icon name="CheckCircle2" className="w-4 h-4 text-green-500" />}
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
              {!isApprovedSeller && user.sellerStatus === 'none' && (
                <div className="mt-4 flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <p className="text-orange-700 text-sm">Want to sell on U Market too?</p>
                  <Link to="/become-seller" className="text-orange-700 text-sm font-bold hover:text-orange-800">
                    Apply now →
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Projects Tab — client */}
        {currentTab === 'projects' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="Briefcase" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">You haven't started any projects with us yet. Let's change that!</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-[#0a0f2c] font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Start a Project →
            </Link>
          </div>
        )}

        {/* Orders Tab */}
        {currentTab === 'orders' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="ShoppingCart" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">Your order history will appear here.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors"
            >
              Browse Shop →
            </Link>
          </div>
        )}

        {/* My Shop Tab — approved sellers only */}
        {currentTab === 'myshop' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="Store" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Products Listed Yet</h3>
            <p className="text-gray-500 mb-6">Start listing products to sell on U Market.</p>
            <Link
              to="/dashboard/add-product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors"
            >
              List a Product →
            </Link>
          </div>
        )}

        {/* Messages Tab */}
        {currentTab === 'messages' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="MessageCircle" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-gray-500 mb-6">Your messages with our team will appear here.</p>
            <a
              href="https://wa.me/2348038786037"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors"
            >
              Chat on WhatsApp →
            </a>
          </div>
        )}

        {/* Settings Tab */}
        {currentTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-6">Account Settings</h3>
            <div className="space-y-4">
              {[
                { label: 'Edit Profile', desc: 'Update your name, email and phone', icon: 'User' },
                { label: 'Change Password', desc: 'Update your account password', icon: 'Lock' },
                { label: 'Notifications', desc: 'Manage your notification preferences', icon: 'Bell' },
                { label: 'Delete Account', desc: 'Permanently delete your account', icon: 'Trash2', danger: true },
              ].map((setting) => (
                <button
                  key={setting.label}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    setting.danger
                      ? 'border-red-100 hover:bg-red-50 text-red-600'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={setting.icon} className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{setting.label}</p>
                      <p className="text-gray-400 text-xs">{setting.desc}</p>
                    </div>
                  </div>
                  <span className="text-gray-300">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
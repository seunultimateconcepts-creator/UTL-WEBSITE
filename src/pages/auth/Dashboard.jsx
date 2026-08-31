import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo_utl.png'
import { getDashboardConfig } from '../../config/dashboardConfig'
import {
  LayoutDashboard, Briefcase, ShoppingCart, Store, MessageCircle,
  Settings, Bell, Plus, FileText, Palette, Home, LogOut, User, Lock,
  Trash2, CheckCircle2, Clock, Menu, X,
} from 'lucide-react'
import ShareLink from '../../components/ShareLink'
import ChatWindow from '../../components/ChatWindow'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [sourcingRequests, setSourcingRequests] = useState([])
  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(false)
  const [activeConversation, setActiveConversation] = useState(null)
  const [myProducts, setMyProducts] = useState([])
  const [myProductsLoading, setMyProductsLoading] = useState(false)

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

  // ✅ Fetch real order + sourcing-request history on MOUNT, not gated
  // by which tab is open — this is what actually fixes the Overview
  // stat cards. Previously those cards showed static config placeholder
  // zeros because nothing loaded until you visited the Orders tab
  // specifically; Overview itself never triggered a fetch at all.
  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      setOrdersLoading(true)
      try {
        const token = localStorage.getItem('utl_token')
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const isApprovedSellerNow = user.sellerStatus === 'approved'
        const endpoint = isApprovedSellerNow ? 'vendor-orders' : 'my-orders'

        const res = await fetch(`${BASE_URL}/orders/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setOrders(data.orders)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setOrdersLoading(false)
      }
    }

    const fetchSourcingRequests = async () => {
      try {
        const token = localStorage.getItem('utl_token')
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${BASE_URL}/sourcing-requests/my-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setSourcingRequests(data.requests)
      } catch (err) {
        console.error('Failed to fetch sourcing requests:', err)
      }
    }

    fetchOrders()
    fetchSourcingRequests()
  }, [user])

  // ✅ Fetch bookings when the Projects tab opens (client-only tab —
  // sellers don't see a Projects tab, so no vendor-side branch needed)
  useEffect(() => {
    if (activeTab !== 'projects' || !user) return

    const fetchBookings = async () => {
      setBookingsLoading(true)
      try {
        const token = localStorage.getItem('utl_token')
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setBookings(data.bookings)
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
      } finally {
        setBookingsLoading(false)
      }
    }
    fetchBookings()
  }, [activeTab, user])

  // ✅ Fetch conversations when Messages tab opens
  useEffect(() => {
    if (activeTab !== 'messages' || !user) return

    const fetchConversations = async () => {
      setConversationsLoading(true)
      try {
        const token = localStorage.getItem('utl_token')
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${BASE_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setConversations(data.conversations)
      } catch (err) {
        console.error('Failed to fetch conversations:', err)
      } finally {
        setConversationsLoading(false)
      }
    }
    fetchConversations()
  }, [activeTab, user])

  // ✅ Fetch the seller's own products (all statuses) when My Shop opens
  useEffect(() => {
    if (activeTab !== 'myshop' || !user) return

    const fetchMyProducts = async () => {
      setMyProductsLoading(true)
      try {
        const token = localStorage.getItem('utl_token')
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${BASE_URL}/products/my-products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setMyProducts(data.products)
      } catch (err) {
        console.error('Failed to fetch my products:', err)
      } finally {
        setMyProductsLoading(false)
      }
    }
    fetchMyProducts()
  }, [activeTab, user])

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ✅ Seller is an UPGRADE, checked via sellerStatus — not a separate
  // accountType. Only an approved seller sees the seller dashboard.
  const isApprovedSeller = user.sellerStatus === 'approved'
  const config = getDashboardConfig(isApprovedSeller ? 'seller' : 'client')
  const { tabs, quickActions } = config
  // ✅ Real computed values, not the static config placeholders.
  // Matched by label since dashboardConfig.js still owns icon/color/
  // which stats exist per role — this only swaps in the actual number.
  const pendingOrdersCount =
    orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length +
    sourcingRequests.filter(r => !['completed', 'cancelled'].includes(r.status)).length
  const activeProjectsCount = bookings.filter(b => !['completed', 'cancelled'].includes(b.status)).length

  const stats = config.stats.map((stat) => {
    if (stat.label === 'Pending Orders') return { ...stat, value: pendingOrdersCount }
    if (stat.label === 'Active Projects') return { ...stat, value: activeProjectsCount }
    return stat
  })

  const validTabIds = tabs.map(t => t.id)
  const currentTab = validTabIds.includes(activeTab) ? activeTab : 'overview'

  const selectTab = (tabId) => {
    setActiveTab(tabId)
    setSidebarOpen(false) // close the drawer on mobile after picking a tab
  }

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
    <>
    <div className="min-h-screen bg-gray-50 flex">

      {/* Mobile overlay — tap to close the drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar — fixed drawer on mobile (slides in), static column on desktop */}
      <div className={`w-64 bg-[#0a0f2c] flex flex-col fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        {/* Logo + mobile close button */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="UTL" className="h-10 w-auto rounded-lg" />
            <div>
              <div className="text-white font-black text-xs">ULTIMATE</div>
              <div className="text-amber-400 font-bold text-[10px] tracking-widest">TECH LAB</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
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
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
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

      {/* Main Content — no left margin on mobile (sidebar is an overlay drawer, not in the flow) */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex-shrink-0 text-gray-500 hover:text-gray-900">
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-gray-900 truncate">
                {tabTitles[currentTab]}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 hidden sm:block">
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Icon name="Bell" className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-500 rounded-xl flex items-center justify-center text-[#0a0f2c] font-bold text-sm flex-shrink-0">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${stat.color}`}>
                    <Icon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="text-orange-700 text-sm">Want to sell on U-Come too?</p>
                  <Link to="/become-seller" className="text-orange-700 text-sm font-bold hover:text-orange-800">
                    Apply now →
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Projects Tab — client (shows real bookings now) */}
        {currentTab === 'projects' && (
          <div className="space-y-3">
            {bookingsLoading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!bookingsLoading && bookings.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <Icon name="Briefcase" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-black text-gray-900 mb-2">No Bookings Yet</h3>
                <p className="text-gray-500 mb-6">You haven't booked any services with us yet. Let's change that!</p>
                <Link
                  to="/book-service"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-[#0a0f2c] font-bold rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Book a Service →
                </Link>
              </div>
            )}

            {!bookingsLoading && bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                  <div>
                    <p className="text-gray-900 font-bold text-sm">{booking.serviceType}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {booking.bookingNumber} · {new Date(booking.scheduledDate).toLocaleString()} · {booking.duration}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                {booking.notes && <p className="text-gray-500 text-xs mt-2 border-t border-gray-50 pt-2">{booking.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {currentTab === 'orders' && (
          <div className="space-y-3">
            {ordersLoading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!ordersLoading && orders.length === 0 && (isApprovedSeller || sourcingRequests.length === 0) && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <Icon name="ShoppingCart" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-black text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">
                  {isApprovedSeller ? 'Orders from customers will appear here.' : 'Your order history will appear here.'}
                </p>
                {!isApprovedSeller && (
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors"
                  >
                    Browse Shop →
                  </Link>
                )}
              </div>
            )}

            {!ordersLoading && orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                  <p className="text-gray-400 text-xs">
                    {order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}
                    {isApprovedSeller && order.buyerId && ` · ${order.buyerId.firstName} ${order.buyerId.lastName}`}
                  </p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1.5 mb-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.name} {item.quantity > 1 && `× ${item.quantity}`}</span>
                      <span className="text-gray-500">{item.currency} {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-gray-500 text-xs font-semibold uppercase">
                    Total {order.deliveryFee != null && '(incl. delivery)'}
                  </span>
                  <span className="text-amber-600 font-bold text-sm">
                    {order.items?.[0]?.currency || 'NGN'} {(order.grandTotal ?? order.totalAmount)?.toLocaleString()}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <p className="text-gray-400 text-[10px] mt-1.5">
                    Delivering to {order.deliveryAddress.address}
                    {order.estimatedDeliveryDays && ` · Est. ${order.estimatedDeliveryDays}`}
                  </p>
                )}
              </div>
            ))}

            {/* Sourcing requests — Ultimate Concepts. Client-only, kept
                visually separate from vendor Product orders above since
                they're a genuinely different thing (no fixed price,
                fulfilled by admin, not a vendor). */}
            {!isApprovedSeller && sourcingRequests.length > 0 && (
              <>
                <h3 className="text-gray-900 font-bold text-sm pt-4 pb-1">Sourcing Requests (Ultimate Concepts)</h3>
                {sourcingRequests.map((request) => (
                  <div key={request._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                      <p className="text-gray-400 text-xs">
                        {request.requestNumber} · {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        request.status === 'completed' ? 'bg-green-100 text-green-700' :
                        request.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        request.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {request.items?.map((item, i) => (
                        <p key={i} className="text-sm">
                          <span className="text-orange-600 font-semibold">{item.platform}:</span>{' '}
                          <span className="text-gray-700">{item.description}</span>
                        </p>
                      ))}
                    </div>
                    {request.status === 'ready' && request.fulfillment?.details && (
                      <div className="mt-3 pt-3 border-t border-gray-50 bg-orange-50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                        <p className="text-orange-700 text-xs font-semibold uppercase mb-0.5">How to get it</p>
                        <p className="text-orange-900 text-sm">{request.fulfillment.details}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* My Shop Tab — approved sellers only, real product management now */}
        {currentTab === 'myshop' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">{myProducts.length} product{myProducts.length !== 1 ? 's' : ''}</p>
              <Link
                to="/dashboard/add-product"
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <Icon name="Plus" className="w-3.5 h-3.5" /> Add Product
              </Link>
            </div>

            {myProductsLoading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!myProductsLoading && myProducts.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <Icon name="Store" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-black text-gray-900 mb-2">No Products Listed Yet</h3>
                <p className="text-gray-500 mb-6">Start listing products to sell on U-Come.</p>
                <Link
                  to="/dashboard/add-product"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors"
                >
                  List a Product →
                </Link>
              </div>
            )}

            {!myProductsLoading && myProducts.map((product) => (
              <Link
                key={product._id}
                to={`/dashboard/edit-product/${product._id}`}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Store" className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 font-bold text-sm truncate">{product.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {product.currency} {product.price?.toLocaleString()} · Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                  product.status === 'active' ? 'bg-green-100 text-green-700' :
                  product.status === 'out_of_stock' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {product.status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Messages Tab */}
        {currentTab === 'messages' && (
          <div className="space-y-3">
            {conversationsLoading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!conversationsLoading && conversations.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <Icon name="MessageCircle" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-black text-gray-900 mb-2">No Messages Yet</h3>
                <p className="text-gray-500 mb-6">
                  {isApprovedSeller ? 'Conversations with buyers will appear here.' : 'Message a seller from any product page to start a conversation.'}
                </p>
                <a
                  href="tel:+2348038786037"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Call Support →
                </a>
              </div>
            )}

            {!conversationsLoading && conversations.map((conv) => {
              const otherParty = user?.id === conv.buyerId?._id ? conv.vendorId : conv.buyerId
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageCircle" className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-bold text-sm truncate">{otherParty?.firstName} {otherParty?.lastName}</p>
                    <p className="text-gray-400 text-xs truncate">Re: {conv.productId?.name}</p>
                    {conv.lastMessagePreview && <p className="text-gray-500 text-xs truncate mt-0.5">{conv.lastMessagePreview}</p>}
                  </div>
                  <p className="text-gray-300 text-[10px] flex-shrink-0">{new Date(conv.lastMessageAt).toLocaleDateString()}</p>
                </button>
              )
            })}
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

    {activeConversation && (
      <ChatWindow
        conversation={activeConversation}
        currentUserId={user?.id}
        onClose={() => setActiveConversation(null)}
      />
    )}
    </>
  )
}

export default Dashboard
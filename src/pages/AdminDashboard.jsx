/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Check, X, Trash2, LogOut, Store, Package, ClipboardList, Calendar, Truck, Image as ImageIcon, Users } from 'lucide-react'
import AdminSourcingRequestCard from './AdminSourcingRequestCard'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [adminKey, setAdminKey] = useState(null)
  const [activeTab, setActiveTab] = useState('sellers')
  const [pendingSellers, setPendingSellers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [sourcingRequests, setSourcingRequests] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    const key = sessionStorage.getItem('utl_admin_key')
    if (!key) {
      navigate('/admin-login')
      return
    }
    setAdminKey(key)
  }, [navigate])

  useEffect(() => {
    if (adminKey) fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sellersRes, productsRes, ordersRes, bookingsRes, requestsRes, vendorsRes] = await Promise.all([
        fetch(`${BASE_URL}/sellers/pending`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/products/all`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/orders/all`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/bookings/all`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/sourcing-requests/all`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/sellers/vendors`, { headers: { 'x-admin-key': adminKey } }),
      ])
      const sellersData = await sellersRes.json()
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      const bookingsData = await bookingsRes.json()
      const requestsData = await requestsRes.json()
      const vendorsData = await vendorsRes.json()

      // ✅ A 403 here means the stored key is wrong — bounce back to login
      if (sellersRes.status === 403 || productsRes.status === 403 || ordersRes.status === 403 || bookingsRes.status === 403 || requestsRes.status === 403 || vendorsRes.status === 403) {
        sessionStorage.removeItem('utl_admin_key')
        navigate('/admin-login')
        return
      }

      if (sellersData.success) setPendingSellers(sellersData.sellers)
      if (productsData.success) setProducts(productsData.products)
      if (ordersData.success) setOrders(ordersData.orders)
      if (bookingsData.success) setBookings(bookingsData.bookings)
      if (requestsData.success) setSourcingRequests(requestsData.requests)
      if (vendorsData.success) setVendors(vendorsData.vendors)
    } catch (err) {
      console.error('Admin data fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const flashMessage = (msg) => {
    setActionMessage(msg)
    setTimeout(() => setActionMessage(''), 3000)
  }

  const handleApprove = async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/sellers/${userId}/approve`, {
        method: 'PATCH',
        headers: { 'x-admin-key': adminKey },
      })
      const data = await res.json()
      if (data.success) {
        flashMessage('Seller approved and notified by email')
        setPendingSellers(prev => prev.filter(s => s._id !== userId))
      }
    } catch (err) {
      console.error('Approve failed:', err)
    }
  }

  const handleReject = async (userId) => {
    if (!window.confirm('Reject this seller application?')) return
    try {
      const res = await fetch(`${BASE_URL}/sellers/${userId}/reject`, {
        method: 'PATCH',
        headers: { 'x-admin-key': adminKey },
      })
      const data = await res.json()
      if (data.success) {
        flashMessage('Application rejected')
        setPendingSellers(prev => prev.filter(s => s._id !== userId))
      }
    } catch (err) {
      console.error('Reject failed:', err)
    }
  }

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"? This can't be undone.`)) return
    try {
      const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      })
      const data = await res.json()
      if (data.success) {
        flashMessage('Product deleted')
        setProducts(prev => prev.filter(p => p._id !== productId))
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        flashMessage(`Booking marked ${status}`)
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b))
      }
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  const handleUpdateVendorTier = async (vendorId, tier) => {
    try {
      const res = await fetch(`${BASE_URL}/sellers/${vendorId}/tier`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (data.success) {
        flashMessage(`Vendor moved to ${tier}`)
        setVendors(prev => prev.map(v => v._id === vendorId
          ? { ...v, subscription: data.subscription, slotsLimit: tier === 'free' ? 10 : tier === 'silver' ? 40 : tier === 'gold' ? 100 : Infinity }
          : v
        ))
      }
    } catch (err) {
      console.error('Tier update failed:', err)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('utl_admin_key')
    navigate('/admin-login')
  }

  if (!adminKey) return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#0a0f2c] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-amber-400" />
          <h1 className="text-white font-black text-lg">Admin Panel</h1>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
          <LogOut size={15} /> Log out
        </button>
      </div>

      {actionMessage && (
        <div className="bg-green-50 border-b border-green-100 px-6 py-2.5">
          <p className="text-green-700 text-sm font-medium">{actionMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6 flex gap-1">
        {[
          { id: 'sellers', label: `Pending Sellers (${pendingSellers.length})`, icon: Store },
          { id: 'vendors', label: `Vendors (${vendors.length})`, icon: Users },
          { id: 'products', label: `All Products (${products.length})`, icon: Package },
          { id: 'orders', label: `All Orders (${orders.length})`, icon: ClipboardList },
          { id: 'bookings', label: `All Bookings (${bookings.length})`, icon: Calendar },
          { id: 'requests', label: `Sourcing Requests (${sourcingRequests.length})`, icon: Truck },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Pending Sellers */}
        {!loading && activeTab === 'sellers' && (
          <div className="space-y-3">
            {pendingSellers.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-12">No pending seller applications.</p>
            )}
            {pendingSellers.map(seller => (
              <div key={seller._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{seller.firstName} {seller.lastName}</p>
                  <p className="text-gray-500 text-xs">{seller.email} · {seller.phone}</p>
                  <p className="text-gray-400 text-[10px] mt-1">Applied {new Date(seller.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(seller._id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-bold rounded-lg transition-colors">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => handleReject(seller._id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold rounded-lg transition-colors">
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Products */}
        {/* Vendors — manual tier assignment until Paystack collection
            exists. Slot usage shown so it's obvious who's near their
            limit before they even ask about upgrading. */}
        {!loading && activeTab === 'vendors' && (
          <div className="space-y-3">
            {vendors.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-12">No approved vendors yet.</p>
            )}
            {vendors.map(vendor => (
              <div key={vendor._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{vendor.firstName} {vendor.lastName}</p>
                  <p className="text-gray-500 text-xs">{vendor.email}</p>
                  <p className="text-gray-400 text-[10px] mt-1">
                    {vendor.slotsUsed} / {vendor.slotsLimit === Infinity ? '∞' : vendor.slotsLimit} listings used
                    {vendor.subscription?.expiresAt && ` · renews ${new Date(vendor.subscription.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>
                <select
                  value={vendor.subscription?.tier || 'free'}
                  onChange={(e) => handleUpdateVendorTier(vendor._id, e.target.value)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border-0 capitalize cursor-pointer ${
                    vendor.subscription?.tier === 'platinum' ? 'bg-purple-100 text-purple-700' :
                    vendor.subscription?.tier === 'gold' ? 'bg-amber-100 text-amber-700' :
                    vendor.subscription?.tier === 'silver' ? 'bg-gray-200 text-gray-700' :
                    'bg-green-100 text-green-700'
                  }`}
                >
                  <option value="free">Free (10)</option>
                  <option value="silver">Silver (40) — ₦20k/yr</option>
                  <option value="gold">Gold (100) — ₦50k/yr</option>
                  <option value="platinum">Platinum (∞ + video) — ₦100k/yr</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* All Products */}
        {!loading && activeTab === 'products' && (
          <div className="space-y-3">
            {products.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-12">No products listed yet.</p>
            )}
            {products.map(product => (
              <div key={product._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{product.name}</p>
                  <p className="text-gray-500 text-xs">
                    {product.vendorId?.firstName} {product.vendorId?.lastName} · {product.currency} {product.price?.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-1">{product.category} · {product.status}</p>
                </div>
                <button onClick={() => handleDeleteProduct(product._id, product.name)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold rounded-lg transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* All Orders — gives whoever holds the admin key (you today,
            a hire tomorrow) full order visibility for confident answers,
            per the "centralized support" principle discussed */}
        {!loading && activeTab === 'orders' && (
          <div className="space-y-3">
            {orders.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-12">No orders placed yet.</p>
            )}
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <p className="text-gray-900 font-bold text-sm">{order.orderNumber}</p>
                    <p className="text-gray-500 text-xs">
                      {order.buyerId?.firstName} {order.buyerId?.lastName} ({order.buyerId?.email})
                      {order.vendorId ? ` → sold by ${order.vendorId.firstName} ${order.vendorId.lastName}` : ' → Ultimate Shop'}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1 pl-3 border-l-2 border-gray-100">
                  {order.items?.map((item, i) => (
                    <p key={i} className="text-gray-600 text-xs">
                      {item.name} {item.quantity > 1 && `× ${item.quantity}`} — {item.currency} {(item.price * item.quantity).toLocaleString()}
                    </p>
                  ))}
                </div>
                {order.deliveryAddress && (
                  <p className="text-gray-500 text-xs mb-2">
                    <span className="font-semibold">Delivering to:</span> {order.deliveryAddress.fullName}, {order.deliveryAddress.address}
                    {order.deliveryAddress.landmark && ` (near ${order.deliveryAddress.landmark})`} · {order.deliveryAddress.phone}
                  </p>
                )}
                <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-50">
                  <span className="text-amber-600 font-bold text-sm">
                    Total: {order.items?.[0]?.currency || 'NGN'} {(order.grandTotal ?? order.totalAmount)?.toLocaleString()}
                    {order.deliveryFee != null && (
                      <span className="text-gray-400 font-normal text-xs ml-1">
                        (incl. ₦{order.deliveryFee.toLocaleString()} delivery)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Bookings — same admin-visibility principle as Orders,
            plus inline status control since bookings need active
            management (confirm/complete/cancel) more than orders do */}
        {!loading && activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-12">No bookings yet.</p>
            )}
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{booking.bookingNumber} · {booking.serviceType}</p>
                  <p className="text-gray-500 text-xs">
                    {booking.customerId?.firstName} {booking.customerId?.lastName} ({booking.customerId?.email}) · {booking.contactPhone}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-1">
                    {new Date(booking.scheduledDate).toLocaleString()} · {booking.duration}
                  </p>
                  {booking.notes && <p className="text-gray-500 text-xs mt-1 italic">"{booking.notes}"</p>}
                </div>
                <select
                  value={booking.status}
                  onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border-0 capitalize cursor-pointer ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}
                >
                  {['requested', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Sourcing Requests — Ultimate Concepts. Each card handles its
            own per-item proof upload and fulfillment, since that's
            meaningfully more complex than a simple status dropdown. */}
        {!loading && activeTab === 'requests' && (
          <div className="space-y-4">
            {sourcingRequests.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-12">No sourcing requests yet.</p>
            )}
            {sourcingRequests.map(request => (
              <AdminSourcingRequestCard
                key={request._id}
                request={request}
                adminKey={adminKey}
                flashMessage={flashMessage}
                onUpdated={(updated) => setSourcingRequests(prev => prev.map(r => r._id === updated._id ? updated : r))}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard
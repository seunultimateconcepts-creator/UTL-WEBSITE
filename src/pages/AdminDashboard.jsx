/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Check, X, Trash2, LogOut, Store, Package } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [adminKey, setAdminKey] = useState(null)
  const [activeTab, setActiveTab] = useState('sellers')
  const [pendingSellers, setPendingSellers] = useState([])
  const [products, setProducts] = useState([])
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
      const [sellersRes, productsRes] = await Promise.all([
        fetch(`${BASE_URL}/sellers/pending`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${BASE_URL}/products/all`, { headers: { 'x-admin-key': adminKey } }),
      ])
      const sellersData = await sellersRes.json()
      const productsData = await productsRes.json()

      // ✅ A 403 here means the stored key is wrong — bounce back to login
      if (sellersRes.status === 403 || productsRes.status === 403) {
        sessionStorage.removeItem('utl_admin_key')
        navigate('/admin-login')
        return
      }

      if (sellersData.success) setPendingSellers(sellersData.sellers)
      if (productsData.success) setProducts(productsData.products)
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
          { id: 'products', label: `All Products (${products.length})`, icon: Package },
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

      </div>
    </div>
  )
}

export default AdminDashboard
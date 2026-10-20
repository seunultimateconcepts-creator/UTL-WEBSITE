/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Store, ShoppingBag, ArrowLeft, PackageX, ShoppingCart, Plus, Search } from 'lucide-react'
import ShareLink from '../../components/ShareLink'
import VendorCartDrawer from '../../components/VendorCartDrawer'
import { useVendorCart } from '../../context/VendorCartContext'
import { getCategoryHighlights } from '../../utils/categoryHighlights'
import { CHECKOUT_MODES, getCheckoutMode } from '../../config/listingCategoryFields'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function VendorStore() {
  // The URL param is EITHER a shopSlug ("rosyfashion") or a raw _id. It
  // is resolved once to the REAL id (state below), and every downstream
  // call - products, cart key, orders - uses that real id, so a vendor's
  // cart can never fragment depending on which link a customer arrived by.
  const { vendorId: urlParam } = useParams()
  const navigate = useNavigate()
  const [vendorId, setVendorId] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [products, setProducts] = useState([])
  const [vendorName, setVendorName] = useState('')
  const [vendorBio, setVendorBio] = useState('')
  const [vendorPhoto, setVendorPhoto] = useState('')
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { addItem, getVendorCartCount } = useVendorCart()

  // ✅ Client-side filter — the vendor's full catalog is already
  // loaded, so there's no need for a server round-trip per keystroke.
  // Matches name, description, and sub-category so "blender", "2L",
  // or "kitchen" all find the same product.
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.subCategory?.toLowerCase().includes(q)
    )
  })

  const handleAddToCart = (e, product) => {
    e.preventDefault() // card is a <Link> — don't navigate when adding to cart
    e.stopPropagation()
    addItem(vendorId, vendorName, {
      productId: product._id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images?.[0] || '',
      stock: product.stock,
      category: product.category,
    }, 1)
    setJustAdded(product._id)
    setTimeout(() => setJustAdded(null), 1200)
  }

  // Step 1 - resolve the URL to the real vendor. If we arrived by raw id
  // but a slug exists, quietly upgrade the address bar to the friendly URL.
  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetch(`${BASE_URL}/sellers/public/${urlParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setVendorId(data.vendor.id)
        setVendorName(data.vendor.shopName)
        setVendorBio(data.vendor.bio)
        setVendorPhoto(data.vendor.shopPhotoUrl)
        if (data.vendor.shopSlug && data.vendor.shopSlug !== urlParam) {
          navigate(`/shop/vendor/${data.vendor.shopSlug}`, { replace: true })
        }
      })
      .catch((err) => {
        console.error('Failed to load vendor profile:', err)
        setNotFound(true)
        setLoading(false)
      })
  }, [navigate, urlParam])

  // Step 2 - only fetch products once we have the REAL id.
  useEffect(() => {
    if (!vendorId) return
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/products?vendorId=${vendorId}`)
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error('Failed to load vendor products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [vendorId])

  if (notFound) {
    return (
      <div className="pt-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <PackageX size={40} className="text-gray-300 mb-4" />
        <p className="text-gray-900 font-bold mb-2">Store not found</p>
        <p className="text-gray-500 text-sm mb-4">This link may be wrong, or the store isn't live yet.</p>
        <Link to="/shop" className="text-amber-600 font-semibold text-sm hover:text-amber-700">← Back to U-Come</Link>
      </div>
    )
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to U-Come
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {vendorPhoto ? (
                  <img src={vendorPhoto} alt={vendorName} className="w-full h-full object-cover" />
                ) : (
                  <Store size={28} className="text-amber-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{vendorName || 'Vendor Store'}</h1>
                {vendorBio && <p className="text-gray-400 text-sm mt-1 max-w-lg">{vendorBio}</p>}
                <p className="text-gray-500 text-xs mt-1">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
              </div>
            </div>
            <ShareLink
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={`${vendorName || 'Vendor Store'} on Ultimate Tech Lab`}
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-gray-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="relative mb-6 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${vendorName || 'this store'}...`}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <PackageX size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-900 font-bold mb-2">No products listed yet</p>
              <p className="text-gray-500 text-sm">This vendor hasn't added any products.</p>
            </div>
          )}

          {!loading && products.length > 0 && filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <PackageX size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-900 font-bold mb-2">No matches</p>
              <p className="text-gray-500 text-sm">Nothing here matches "{searchQuery}".</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/shop/vendor/${urlParam}/product/${product._id}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 mb-3">
                    {product.category}
                  </span>
                  <h3 className="text-gray-900 font-bold text-sm leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  {getCategoryHighlights(product).length > 0 && (
                    <p className="text-gray-500 text-xs mb-2">
                      {getCategoryHighlights(product).join(' · ')}
                    </p>
                  )}
                  <p className="text-amber-600 font-black text-lg">
                    {product.currency} {product.price.toLocaleString()}
                  </p>
                  {product.stock === 0 ? (
                    <p className="text-red-500 text-xs font-semibold mt-1">Out of stock</p>
                  ) : getCheckoutMode(product) === CHECKOUT_MODES.BUY_NOW ? (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full flex items-center justify-center gap-1.5 mt-3 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                        justAdded === product._id
                          ? 'bg-green-500 text-white'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                      }`}
                    >
                      {justAdded === product._id ? 'Added ✓' : <><Plus size={13} /> Add to Cart</>}
                    </button>
                  ) : (
                    /* ✅ Bookings, appointments, and service requests each
                       need their own details captured at checkout, so they
                       can't go in a shared cart — the card links through to
                       the product page where the right form renders. */
                    <span className="block w-full text-center mt-3 py-2.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-700">
                      {getCheckoutMode(product) === CHECKOUT_MODES.BOOK_DATES ? 'Book Now'
                        : getCheckoutMode(product) === CHECKOUT_MODES.TIME_SLOT ? 'Book Appointment'
                        : 'Request Service'} →
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Floating cart button — only shows once something's been added */}
      {getVendorCartCount(vendorId) > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3.5 bg-[#0a0f2c] hover:bg-[#0a0f2c]/90 text-white font-bold rounded-full shadow-xl transition-all hover:-translate-y-0.5"
        >
          <ShoppingCart size={18} />
          <span className="text-sm">{getVendorCartCount(vendorId)}</span>
        </button>
      )}

      <VendorCartDrawer vendorId={vendorId} open={cartOpen} onClose={() => setCartOpen(false)} />

    </div>
  )
}

export default VendorStore
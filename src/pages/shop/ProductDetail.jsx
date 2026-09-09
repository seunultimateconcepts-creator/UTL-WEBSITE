import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Truck, RotateCcw, Send, MessageCircle, Pencil, ShoppingCart } from 'lucide-react'
import ProductChat from '../../components/ProductChat'
import ShareLink from '../../components/ShareLink'
import OrderConfirmation from '../../components/OrderConfirmation'
import AddressForm from '../../components/AddressForm'
import BookingDateForm from '../../components/BookingDateForm'
import ChatWindow from '../../components/ChatWindow'
import VendorCartDrawer from '../../components/VendorCartDrawer'
import { useVendorCart } from '../../context/VendorCartContext'
import { BOOKING_CATEGORIES, RANGE_DATE_CATEGORIES } from '../../config/listingCategoryFields'
import { getCategoryHighlights } from '../../utils/categoryHighlights'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function ProductDetail() {
  const { vendorId, productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [orderError, setOrderError] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [bookedDates, setBookedDates] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [startingChat, setStartingChat] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, getVendorCartCount } = useVendorCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/products/${productId}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.product)
          setVendor(data.vendor)
          if (BOOKING_CATEGORIES.includes(data.product.category)) {
            fetch(`${BASE_URL}/orders/booked-dates/${productId}`)
              .then((r) => r.json())
              .then((d) => { if (d.success) setBookedDates(d.bookedDates) })
              .catch((err) => console.error('Failed to load booked dates:', err))
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  // ✅ Clicking "Place Order" opens the address step first — actual
  // order creation happens in handlePlaceOrder once address is submitted
  // ✅ Opens (or creates) the direct conversation for this product.
  // Login-gated same as ordering — no anonymous messaging.
  const handleStartChat = async () => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      localStorage.setItem('utl_redirect_after_login', `/shop/vendor/${vendorId}/product/${productId}`)
      navigate('/login')
      return
    }

    setStartingChat(true)
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/messages/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (data.success) setActiveConversation(data.conversation)
    } catch (err) {
      console.error('Failed to start conversation:', err)
    } finally {
      setStartingChat(false)
    }
  }

  const handleOrderClick = () => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      localStorage.setItem('utl_redirect_after_login', `/shop/vendor/${vendorId}/product/${productId}`)
      navigate('/login')
      return
    }
    setShowAddressForm(true)
  }

  const handleAddToCart = () => {
    addItem(vendorId, vendor ? (vendor.shopName || `${vendor.firstName} ${vendor.lastName}`) : '', {
      productId,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images?.[0] || '',
      stock: product.stock,
      category: product.category,
    }, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const needsBooking = BOOKING_CATEGORIES.includes(product?.category)
  const isRangeBooking = RANGE_DATE_CATEGORIES.includes(product?.category)

  const handlePlaceOrder = async (formData) => {
    const currentUser = localStorage.getItem('utl_current_user')
    const user = JSON.parse(currentUser)
    setPlacing(true)
    setOrderError('')

    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendorId,
          items: [{
            productId,
            name: product.name,
            price: product.price,
            currency: product.currency,
            store: vendor ? `${vendor.firstName} ${vendor.lastName}` : '',
            quantity: 1,
          }],
          ...(needsBooking ? { bookingDetails: formData } : { deliveryAddress: formData }),
        }),
      })
      const data = await res.json()

      if (!data.success) {
        setOrderError(data.message || 'Something went wrong placing your order. Please try again.')
        return
      }

      localStorage.setItem(
        'utl_current_user',
        JSON.stringify({ ...user, dashboardUnlocked: true })
      )
      setShowAddressForm(false)
      setConfirmedOrder(data.order)
    } catch (err) {
      console.error('Order creation failed:', err)
      setOrderError('Network error — please check your connection and try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={40} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-black text-gray-900 mb-2">Product not found</h2>
        <Link to="/shop" className="text-orange-600 font-semibold text-sm hover:text-orange-700">← Back to U-Come</Link>
      </div>
    )
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Link
          to={`/shop/vendor/${vendorId}`}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to store
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left — Images */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-80 flex items-center justify-center mb-3">
              {product.images?.length > 0 ? (
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag size={48} className="text-gray-300" />
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-orange-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                {product.category}
              </span>
              <ShareLink
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={product.name}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
            {vendor && (
              <Link to={`/shop/vendor/${vendorId}`} className="text-gray-500 text-sm hover:text-orange-600 transition-colors">
                Sold by {vendor.firstName} {vendor.lastName}
              </Link>
            )}

            <p className="text-3xl font-black text-amber-600 my-4">
              {product.currency} {product.price.toLocaleString()}
            </p>

            {getCategoryHighlights(product).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {getCategoryHighlights(product).map((h, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg">
                    {h}
                  </span>
                ))}
              </div>
            )}

            {product.stock === 0 ? (
              <span className="inline-block text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg mb-4">Out of stock</span>
            ) : (
              <span className="inline-block text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mb-4">In stock</span>
            )}

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Category-specific details — generic rendering, works for
                any category since the fields themselves are dynamic */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                {Object.entries(product.attributes).map(([key, value]) => (
                  value ? (
                    <div key={key}>
                      <p className="text-gray-400 text-[10px] uppercase font-semibold">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                      </p>
                      <p className="text-gray-900 text-sm font-medium">{value}</p>
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {orderError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-sm">{orderError}</p>
              </div>
            )}

            {(() => {
              // ✅ SECURITY FIX: this used to compare cachedUser.id to
              // vendor._id, but the backend never actually sent
              // vendor._id at all — so vendor._id was ALWAYS undefined,
              // and this check silently became `cachedUser.id ===
              // undefined`. Any visitor whose cached user object
              // happened to lack a defined .id (any logged-out state,
              // or a malformed/stale cache) got treated as if they
              // owned EVERY product on the site, and shown the "Edit
              // It" button. Both the missing vendor._id (see
              // productController.js getById) and this check are now
              // fixed — the check requires BOTH ids to be real,
              // non-empty values before ever calling it a match, so
              // undefined can never accidentally equal undefined here.
              // The actual save action was always safe regardless —
              // updateMyProduct enforces this server-side too — this
              // was a misleading-UI bug, not a data-tampering one.
              const cachedUser = JSON.parse(localStorage.getItem('utl_current_user') || '{}')
              const currentUserId = cachedUser.id || cachedUser._id
              const vendorId = vendor?._id
              const isOwnProduct = !!currentUserId && !!vendorId && String(currentUserId) === String(vendorId)

              if (isOwnProduct) {
                return (
                  <Link
                    to={`/dashboard/edit-product/${productId}`}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all mb-6"
                  >
                    <Pencil size={16} /> This Is Your Listing — Edit It
                  </Link>
                )
              }

              return (
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={handleOrderClick}
                    disabled={product.stock === 0 || placing}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    <Send size={16} /> {product.stock === 0 ? 'Out of Stock' : needsBooking ? 'Book Now' : 'Place Order'}
                  </button>
                  {product.stock > 0 && (
                    <button
                      onClick={handleAddToCart}
                      className={`flex-shrink-0 flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold transition-all ${
                        justAdded ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="Add to cart"
                    >
                      <ShoppingCart size={16} /> {justAdded && 'Added'}
                    </button>
                  )}
                </div>
              )
            })()}

            {(product.policies?.delivery || product.policies?.returns) && (
              <div className="space-y-3 mb-6">
                {product.policies.delivery && (
                  <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
                    <Truck size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">Delivery</p>
                      <p className="text-gray-500 text-xs">{product.policies.delivery}</p>
                    </div>
                  </div>
                )}
                {product.policies.returns && (
                  <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
                    <RotateCcw size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">Returns</p>
                      <p className="text-gray-500 text-xs">{product.policies.returns}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Direct message — open, not AI-gated, now that off-platform
            trade handling is the accepted model */}
        <div className="mt-10 max-w-2xl">
          <button
            onClick={handleStartChat}
            disabled={startingChat}
            className="flex items-center gap-2 px-5 py-3 bg-[#0a0f2c] hover:bg-[#0a0f2c]/90 text-white font-bold rounded-xl transition-colors text-sm mb-6"
          >
            <MessageCircle size={16} /> {startingChat ? 'Opening chat...' : 'Message Seller Directly'}
          </button>

          <h2 className="text-gray-900 font-bold text-lg mb-3">Have a question?</h2>
          <ProductChat productId={productId} />
        </div>

      </div>

      {/* Direct chat window */}
      {activeConversation && (() => {
        const cachedUser = JSON.parse(localStorage.getItem('utl_current_user') || '{}')
        const currentUserId = cachedUser.id || cachedUser._id
        // ✅ buyerId._id is a populated Mongoose ObjectId, currentUserId
        // is a plain string from localStorage — strict equality (===)
        // never coerces types, so this always evaluated false
        // regardless of whether they actually matched. String(...) on
        // both sides fixes it.
        const isBuyer = String(activeConversation.buyerId._id) === String(currentUserId)
        const otherParty = isBuyer ? activeConversation.vendorId : activeConversation.buyerId
        return (
          <ChatWindow
            conversationId={activeConversation._id}
            viewerRole={isBuyer ? 'buyer' : 'vendor'}
            otherPartyName={`${otherParty.firstName} ${otherParty.lastName}`}
            otherPartyPhone={otherParty.phone}
            contextLabel={`Re: ${activeConversation.productId?.name}`}
            onClose={() => setActiveConversation(null)}
          />
        )
      })()}

      {/* Address or booking-date modal — shown before order creation */}
      {showAddressForm && !confirmedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            {orderError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm">{orderError}</p>
              </div>
            )}
            {needsBooking ? (
              <BookingDateForm
                isRange={isRangeBooking}
                bookedDates={bookedDates}
                onSubmit={handlePlaceOrder}
                submitting={placing}
                submitLabel="Book Now"
              />
            ) : (
              <AddressForm
                onSubmit={handlePlaceOrder}
                submitting={placing}
                submitLabel="Place Order"
              />
            )}
          </div>
        </div>
      )}

      {/* Order confirmation modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <OrderConfirmation
              order={confirmedOrder}
              onContinue={() => setConfirmedOrder(null)}
              continueLabel="Keep Browsing"
              vendorBankDetails={vendor?.bankDetails}
            />
          </div>
        </div>
      )}

      {/* Floating cart button — only shows once something's been added */}
      {getVendorCartCount(vendorId) > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 pl-4 pr-5 py-3.5 bg-[#0a0f2c] hover:bg-[#0a0f2c]/90 text-white font-bold rounded-full shadow-xl transition-all hover:-translate-y-0.5"
        >
          <ShoppingCart size={18} />
          <span className="text-sm">{getVendorCartCount(vendorId)}</span>
        </button>
      )}

      <VendorCartDrawer vendorId={vendorId} open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default ProductDetail
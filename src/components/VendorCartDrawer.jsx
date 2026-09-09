/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react'
import { useVendorCart } from '../context/VendorCartContext'
import AddressForm from './AddressForm'
import BookingDateForm from './BookingDateForm'
import OrderConfirmation from './OrderConfirmation'
import { BOOKING_CATEGORIES, RANGE_DATE_CATEGORIES } from '../config/listingCategoryFields'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * VendorCartDrawer
 *
 * The multi-item checkout counterpart to CartDrawer.jsx (that one's
 * for Ultimate Concepts sourcing requests). This one checks out a
 * SINGLE vendor's cart against POST /orders — one Order per vendor,
 * matching how Order.vendorId works (exactly one vendor per order).
 *
 * Usage: <VendorCartDrawer vendorId={vendorId} open={bool} onClose={fn} />
 */
export default function VendorCartDrawer({ vendorId, open, onClose }) {
  const { getCart, removeItem, updateQuantity, clearVendorCart } = useVendorCart()
  const cart = getCart(vendorId)
  const [step, setStep] = useState('cart') // 'cart' | 'checkout' | 'confirmed'
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [vendorBankDetails, setVendorBankDetails] = useState(null)

  // ✅ Simplification worth knowing about: if a vendor's cart somehow
  // mixes a booking-category item (hotel/property/event/travel) with
  // a regular physical item, checkout goes with whichever the FIRST
  // item needs. In practice a vendor's businessCategory keeps their
  // whole catalog one type, so this basically never comes up — but
  // it's not enforced at the schema level, so noting it rather than
  // silently guessing wrong for an edge case.
  const needsBooking = cart.items.some((i) => BOOKING_CATEGORIES.includes(i.category))
  const isRangeBooking = cart.items.some((i) => RANGE_DATE_CATEGORIES.includes(i.category))

  useEffect(() => {
    if (step === 'checkout' && cart.items[0]?.productId && !vendorBankDetails) {
      fetch(`${BASE_URL}/products/${cart.items[0].productId}`)
        .then((r) => r.json())
        .then((data) => { if (data.success) setVendorBankDetails(data.vendor?.bankDetails) })
        .catch((err) => console.error('Failed to load vendor bank details:', err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const handleCheckout = async (formData) => {
    const token = localStorage.getItem('utl_token')
    if (!token) {
      localStorage.setItem('utl_redirect_after_login', window.location.pathname)
      window.location.href = '/login'
      return
    }

    setPlacing(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          vendorId,
          items: cart.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            currency: i.currency,
            quantity: i.quantity,
          })),
          ...(needsBooking ? { bookingDetails: formData } : { deliveryAddress: formData }),
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }
      setConfirmedOrder(data.order)
      clearVendorCart(vendorId)
      setStep('confirmed')
    } catch (err) {
      console.error('Checkout failed:', err)
      setError('Network error — please check your connection and try again.')
    } finally {
      setPlacing(false)
    }
  }

  const handleClose = () => {
    setStep('cart')
    setError('')
    setConfirmedOrder(null)
    setVendorBankDetails(null)
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 bg-black/50 z-40" />

      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="flex items-center gap-2 font-black text-gray-900">
            <ShoppingBag size={18} className="text-orange-500" />
            {step === 'confirmed' ? 'Order Placed' : step === 'checkout' ? 'Checkout' : cart.vendorName || 'Your Cart'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto">
            <OrderConfirmation
              order={confirmedOrder}
              onContinue={handleClose}
              continueLabel="Keep Browsing"
              vendorBankDetails={vendorBankDetails}
            />
          </div>
        )}

        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.items.length === 0 && (
                <div className="text-center py-16">
                  <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-400 text-sm">Your cart is empty</p>
                </div>
              )}
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-3 border border-gray-100 rounded-xl p-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={18} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-semibold line-clamp-1">{item.name}</p>
                    <p className="text-amber-600 text-sm font-bold mt-0.5">
                      {item.currency} {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateQuantity(vendorId, item.productId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-gray-900 text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(vendorId, item.productId, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock ?? Infinity)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(vendorId, item.productId)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {cart.items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Subtotal ({cart.count} item{cart.count !== 1 ? 's' : ''})</span>
                  <span className="text-gray-900 font-bold">{cart.items[0]?.currency} {cart.total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all"
                >
                  Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <div className="flex-1 overflow-y-auto p-5">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {needsBooking ? (
              <BookingDateForm isRange={isRangeBooking} onSubmit={handleCheckout} submitting={placing} submitLabel="Place Order" />
            ) : (
              <AddressForm onSubmit={handleCheckout} submitting={placing} submitLabel="Place Order" />
            )}
            <button
              onClick={() => setStep('cart')}
              className="w-full mt-3 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-semibold"
            >
              ← Back to cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
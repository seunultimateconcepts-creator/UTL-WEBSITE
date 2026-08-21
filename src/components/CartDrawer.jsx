import { useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, Send } from 'lucide-react'
import { useCart } from '../context/CartContext'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, cartTotal } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      localStorage.setItem('utl_redirect_after_login', '/shop/ultimate')
      window.location.href = '/login'
      return
    }

    setCheckingOut(true)
    const user = JSON.parse(currentUser)
    let orderNumber = null

    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            price: i.price,
            currency: 'NGN',
            store: i.store,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.success) {
        orderNumber = data.order.orderNumber
        localStorage.setItem(
          'utl_current_user',
          JSON.stringify({ ...user, dashboardUnlocked: true })
        )
      }
    } catch (err) {
      console.error('Order creation failed (continuing to WhatsApp anyway):', err)
    }

    const itemLines = items
      .map((i) => `• ${i.name} (${i.store}) x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`)
      .join('\n')

    const message = `
🛒 *New Order from Ultimate Shop!*
${orderNumber ? `\n*Order Number:* ${orderNumber}` : ''}

*Customer:* ${user.firstName} ${user.lastName}
*Email:* ${user.email}
*Phone:* ${user.phone}

*Items:*
${itemLines}

*Total:* ₦${cartTotal.toLocaleString()}

Please process this order. Thank you!`.trim()

    window.open(`https://wa.me/2348038786037?text=${encodeURIComponent(message)}`, '_blank')
    clearCart()
    setCheckingOut(false)
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="flex items-center gap-2 font-black text-gray-900">
            <ShoppingBag size={18} className="text-orange-500" /> Your Cart
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400 text-sm">Your cart is empty</p>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex gap-3 border border-gray-100 rounded-xl p-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold text-sm line-clamp-1">{item.name}</p>
                <p className="text-gray-400 text-xs mb-2">{item.store}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-amber-600 font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="text-gray-900 font-black text-lg">₦{cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all"
            >
              <Send size={16} /> {checkingOut ? 'Placing Order...' : 'Checkout via WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
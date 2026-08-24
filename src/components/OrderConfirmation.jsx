import { CheckCircle2, Package, Bot, Phone, LayoutDashboard, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * OrderConfirmation
 *
 * Replaces the old "auto-redirect to WhatsApp" pattern. The order is
 * already saved server-side by the time this renders.
 *
 * ✅ No WhatsApp link here on purpose — this app already runs a
 * site-wide AI chatbot (see ChatBot.jsx, the floating "Ask me
 * anything!" bubble) for the AI-first support tier. A raw WhatsApp
 * link would reopen the exact off-platform-negotiation risk that
 * ProductChat's contact filtering was built to close. If someone
 * genuinely needs a human, they get ONE centralized phone number to
 * CALL — not a chat channel, which is much easier to steer toward an
 * off-platform arrangement than a live phone call is.
 *
 * Usage:
 * <OrderConfirmation order={order} onContinue={() => ...} />
 */

// ⚠️ TODO: move this to a real settings/admin field once there's a
// designated support person — hardcoded for now since it's just you.
const SUPPORT_PHONE = '+2348038786037'

export default function OrderConfirmation({ order, onContinue, continueLabel = 'Continue Shopping' }) {
  return (
    <div className="text-center py-6 px-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-1">Order Placed!</h3>
      <p className="text-gray-500 text-sm mb-5">
        We've received your order and will confirm availability shortly.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-5 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-orange-500" />
          <span className="text-gray-900 font-bold text-sm">{order.orderNumber}</span>
        </div>

        <div className="space-y-2 mb-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.name} {item.quantity > 1 && `× ${item.quantity}`}</span>
              <span className="text-gray-900 font-medium">
                {item.currency} {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {order.deliveryAddress && (
          <div className="text-xs text-gray-500 border-t border-gray-200 pt-3 mb-3">
            <p className="font-semibold text-gray-700 mb-0.5">Delivering to {order.deliveryAddress.fullName}</p>
            <p>{order.deliveryAddress.address}</p>
            {order.deliveryAddress.landmark && <p>Near: {order.deliveryAddress.landmark}</p>}
            {order.estimatedDeliveryDays && <p className="mt-1 text-orange-600 font-medium">Est. arrival: {order.estimatedDeliveryDays}</p>}
          </div>
        )}

        <div className="space-y-1 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span>{order.items?.[0]?.currency || 'NGN'} {order.totalAmount?.toLocaleString()}</span>
          </div>
          {order.deliveryFee != null && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Delivery Fee</span>
              <span>{order.items?.[0]?.currency || 'NGN'} {order.deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-500 text-xs font-semibold uppercase">Total</span>
            <span className="text-amber-600 font-black">
              {order.items?.[0]?.currency || 'NGN'} {(order.grandTotal ?? order.totalAmount)?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* AI-first support note, human fallback is a CALL, never a chat link */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5 text-left">
        <Bot size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-xs leading-relaxed">
          Questions about this order? Use the chat assistant (bottom-right of your screen) for instant answers.
          For anything it can't resolve, call us directly — we don't handle order questions over chat outside the app.
        </p>
      </div>

      <div className="space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm"
        >
          <LayoutDashboard size={15} /> View My Orders
        </Link>
        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
        >
          <Phone size={15} /> Call Support: {SUPPORT_PHONE}
        </a>
        {onContinue && (
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 w-full py-3 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
          >
            <ShoppingBag size={15} /> {continueLabel}
          </button>
        )}
      </div>
    </div>
  )
}
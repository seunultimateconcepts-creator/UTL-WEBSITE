/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Printer, ArrowLeft, Calendar, MapPin } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Receipt
 *
 * "Auto-generated" in the sense that no separate action produces it —
 * it's just this page, rendered on demand from the order data that
 * already exists the moment paymentStatus flips to 'confirmed' (see
 * confirmOrderPayment in orderController.js). Nothing is stored or
 * generated ahead of time; there's no PDF file sitting anywhere.
 * "Download" is just the browser's own print-to-PDF via window.print().
 */
export default function Receipt() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('utl_token')
        const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setOrder(data.order)
        } else {
          setError(data.message || 'Order not found')
        }
      } catch (err) {
        setError('Failed to load receipt')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-900 font-bold mb-2">{error || 'Order not found'}</p>
        <Link to="/dashboard?tab=orders" className="text-amber-600 font-semibold text-sm hover:text-amber-700">← Back to Dashboard</Link>
      </div>
    )
  }

  if (order.paymentStatus !== 'confirmed') {
    return (
      <div className="pt-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-900 font-bold mb-2">Receipt not available yet</p>
        <p className="text-gray-500 text-sm mb-4">This order's payment hasn't been confirmed yet.</p>
        <Link to="/dashboard?tab=orders" className="text-amber-600 font-semibold text-sm hover:text-amber-700">← Back to Dashboard</Link>
      </div>
    )
  }

  const currency = order.items?.[0]?.currency || 'NGN'

  return (
    <div className="pt-16 bg-gray-50 min-h-screen print:bg-white print:pt-0">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/dashboard?tab=orders" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0f2c] hover:bg-[#0a0f2c]/90 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm print:shadow-none print:border-0 p-8">

          <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-xl font-black text-gray-900">Ultimate Tech Lab</h1>
              <p className="text-gray-400 text-xs">ultechlab.com</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-green-600 mb-1">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">PAID</span>
              </div>
              <p className="text-gray-400 text-xs">Receipt #{order.orderNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-semibold mb-0.5">Billed To</p>
              <p className="text-gray-900 font-medium">{order.buyerId?.firstName} {order.buyerId?.lastName}</p>
              <p className="text-gray-500 text-xs">{order.buyerId?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px] uppercase font-semibold mb-0.5">Sold By</p>
              <p className="text-gray-900 font-medium">
                {order.vendorId ? (order.vendorId.vendorProfile?.shopName || `${order.vendorId.firstName} ${order.vendorId.lastName}`) : 'Ultimate Tech Lab'}
              </p>
              <p className="text-gray-500 text-xs">Paid {new Date(order.paymentConfirmedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {order.bookingDetails?.startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-gray-50 rounded-xl p-3">
              <Calendar size={14} className="text-gray-400" />
              {new Date(order.bookingDetails.startDate).toLocaleDateString()}
              {order.bookingDetails.endDate && ` — ${new Date(order.bookingDetails.endDate).toLocaleDateString()}`}
            </div>
          )}

          {order.deliveryAddress?.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mb-6 bg-gray-50 rounded-xl p-3">
              <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <span>{order.deliveryAddress.address}{order.deliveryAddress.landmark && `, near ${order.deliveryAddress.landmark}`}</span>
            </div>
          )}

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase">
                <th className="text-left font-semibold pb-2">Item</th>
                <th className="text-center font-semibold pb-2">Qty</th>
                <th className="text-right font-semibold pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2.5 text-gray-900">{item.name}</td>
                  <td className="py-2.5 text-center text-gray-500">{item.quantity}</td>
                  <td className="py-2.5 text-right text-gray-900 font-medium">
                    {item.currency} {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{currency} {order.totalAmount?.toLocaleString()}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Delivery Fee</span>
                <span>{currency} {order.deliveryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-900 font-bold">Total Paid</span>
              <span className="text-amber-600 font-black text-lg">
                {currency} {(order.grandTotal ?? order.totalAmount)?.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-[10px] text-center mt-8">
            This receipt confirms the vendor's own confirmation of a direct bank transfer. Ultimate Tech Lab facilitates the listing but does not process or hold this payment.
          </p>
        </div>
      </div>
    </div>
  )
}
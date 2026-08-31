import { CheckCircle2, Package, Bot, Phone, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'

const SUPPORT_PHONE = '+2348038786037'

export default function SourcingRequestConfirmation({ request, onContinue }) {
  return (
    <div className="text-center py-6 px-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-1">Request Sent!</h3>
      <p className="text-gray-500 text-sm mb-5">
        We'll start sourcing your item(s) and keep you updated.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-5 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-orange-500" />
          <span className="text-gray-900 font-bold text-sm">{request.requestNumber}</span>
        </div>
        <div className="space-y-2">
          {request.items?.map((item, i) => (
            <div key={i} className="text-sm">
              <span className="text-orange-600 font-semibold">{item.platform}:</span>{' '}
              <span className="text-gray-700">{item.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5 text-left">
        <Bot size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-xs leading-relaxed">
          Questions about this request? Use the chat assistant (bottom-right) first.
          For anything it can't resolve, call us directly.
        </p>
      </div>

      <div className="space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm"
        >
          <LayoutDashboard size={15} /> Track My Requests
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
            className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  )
}
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarCheck } from 'lucide-react'
import BookingForm from '../components/BookingForm'
import BookingConfirmation from '../components/BookingConfirmation'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function BookService() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [error, setError] = useState('')
  const [userPhone, setUserPhone] = useState('')

  useEffect(() => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      localStorage.setItem('utl_redirect_after_login', '/book-service')
      navigate('/login')
      return
    }
    const user = JSON.parse(currentUser)
    setUserPhone(user.phone || '')
  }, [navigate])

  const handleSubmit = async (bookingData) => {
    setSubmitting(true)
    setError('')
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }

      // Keep dashboardUnlocked in sync locally, same pattern as orders
      const currentUser = JSON.parse(localStorage.getItem('utl_current_user'))
      localStorage.setItem(
        'utl_current_user',
        JSON.stringify({ ...currentUser, dashboardUnlocked: true })
      )

      setConfirmedBooking(data.booking)
    } catch (err) {
      console.error('Booking failed:', err)
      setError('Network error — please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-10">

        <Link to="/services" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Services
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {confirmedBooking ? (
            <BookingConfirmation booking={confirmedBooking} onContinue={() => navigate('/dashboard')} />
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                  <CalendarCheck size={20} className="text-amber-600" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">Book a Service</h1>
                  <p className="text-gray-500 text-sm">Pick a service, date, and time that works for you.</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <BookingForm onSubmit={handleSubmit} submitting={submitting} defaultPhone={userPhone} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookService
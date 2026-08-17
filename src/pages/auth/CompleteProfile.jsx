/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Store } from 'lucide-react'
import logo from '../../assets/logo_utl.png'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function CompleteProfile() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('client')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('utl_token')
    const userStr = localStorage.getItem('utl_current_user')
    if (!token || !userStr) {
      navigate('/login')
      return
    }
    const user = JSON.parse(userStr)
    if (user.accountTypeConfirmed) {
      navigate('/dashboard')
      return
    }
    setFirstName(user.firstName || '')
  }, [navigate])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/auth/oauth/complete-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountType: selected }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || 'Something went wrong')
      }

      localStorage.setItem('utl_current_user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const options = [
    { id: 'client', label: 'Client', desc: 'I want to hire services', icon: User },
    { id: 'seller', label: 'Seller', desc: 'I want to sell products', icon: Store },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 border border-white/10 shadow-2xl">

        <div className="text-center mb-8">
          <img src={logo} alt="UTL" className="h-12 w-auto rounded-xl mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-2">
            Almost there{firstName ? `, ${firstName}` : ''}!
          </h2>
          <p className="text-gray-400 text-sm">One quick question before your dashboard is ready.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          I'm joining as a
        </label>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {options.map((opt) => {
            const OptIcon = opt.icon
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selected === opt.id
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <OptIcon size={22} className={selected === opt.id ? 'text-amber-400' : 'text-gray-400'} />
                <p className="text-white text-sm font-bold mt-2">{opt.label}</p>
                <p className="text-gray-400 text-xs">{opt.desc}</p>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-[#0a0f2c] font-bold rounded-xl transition-all"
        >
          {loading ? 'Setting up...' : 'Continue to Dashboard →'}
        </button>
      </div>
    </div>
  )
}

export default CompleteProfile
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock } from 'lucide-react'

function AdminLogin() {
  const navigate = useNavigate()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!key.trim()) {
      setError('Enter your admin key')
      return
    }
    // ✅ sessionStorage, not localStorage — clears when the browser tab
    // closes rather than persisting indefinitely. There's no way to
    // validate the key without hitting a protected endpoint, so we just
    // store it and let the first real admin request fail loudly if wrong.
    sessionStorage.setItem('utl_admin_key', key.trim())
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 max-w-sm w-full">
        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
          <ShieldCheck size={22} className="text-amber-400" />
        </div>
        <h1 className="text-white font-black text-xl mb-1">Admin Access</h1>
        <p className="text-gray-400 text-sm mb-6">Enter your admin key to continue.</p>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin key"
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <button type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
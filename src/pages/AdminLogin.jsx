import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AdminLogin() {
  const navigate = useNavigate()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!key.trim()) {
      setError('Enter your admin key')
      return
    }

    // ✅ Actually verify the key against a real protected endpoint
    // BEFORE navigating — this is what was missing. The old version
    // stored whatever was typed and navigated regardless of whether
    // it was correct, relying on AdminDashboard to catch a bad key
    // downstream. Checking here means a wrong key gets a clear,
    // immediate "incorrect" message instead of a confusing blank
    // dashboard with every tab silently showing zero.
    setVerifying(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/sellers/pending`, {
        headers: { 'x-admin-key': key.trim() },
      })
      const data = await res.json()

      if (res.status === 403 || !data.success) {
        setError('Incorrect admin key')
        return
      }

      sessionStorage.setItem('utl_admin_key', key.trim())
      navigate('/admin')
    } catch (err) {
      console.error('Admin key verification failed:', err)
      setError('Network error — please try again')
    } finally {
      setVerifying(false)
    }
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
          <button type="submit" disabled={verifying}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-600 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm">
            {verifying ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
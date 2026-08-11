import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import logo from '../../assets/logo_utl.png'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 border border-white/10 shadow-2xl">

        <div className="text-center mb-8">
          <img src={logo} alt="UTL" className="h-12 w-auto rounded-xl mx-auto mb-6" />
          {success ? (
            <>
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white mb-2">Password Reset!</h2>
              <p className="text-gray-400 text-sm">Redirecting to login in 3 seconds...</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white mb-2">Reset Password 🔒</h2>
              <p className="text-gray-400 text-sm">Enter your new password below.</p>
            </>
          )}
        </div>

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required placeholder="Repeat password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password strength */}
            <div className="flex gap-1">
              {[1,2,3,4].map((level) => (
                <div key={level} className={`h-1 flex-1 rounded-full transition-all ${
                  password.length === 0 ? 'bg-white/10' :
                  password.length < 6 && level <= 1 ? 'bg-red-500' :
                  password.length < 8 && level <= 2 ? 'bg-yellow-500' :
                  password.length < 12 && level <= 3 ? 'bg-blue-500' :
                  password.length >= 12 && level <= 4 ? 'bg-green-500' :
                  'bg-white/10'
                }`} />
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition-all text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : 'Reset Password →'}
            </button>

            <Link to="/login"
              className="block text-center text-gray-400 text-sm hover:text-white transition-colors">
              ← Back to Login
            </Link>
          </form>
        )}

        {success && (
          <Link to="/login"
            className="block w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-center text-sm">
            Go to Login →
          </Link>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../services/api'
import logo from '../../assets/logo_utl.png'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
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
          {!sent ? (
            <>
              <h2 className="text-2xl font-black text-white mb-2">Forgot Password?</h2>
              <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-black text-white mb-2">Reset Link Sent!</h2>
              <p className="text-gray-400 text-sm">Check your email for the password reset link.</p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition-all text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : 'Send Reset Link →'}
            </button>
            <Link to="/login"
              className="block text-center text-gray-400 text-sm hover:text-white transition-colors">
              ← Back to Login
            </Link>
          </form>
        ) : (
          <div className="space-y-3">
            <Link to="/login"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center text-sm transition-all">
              Back to Login
            </Link>
            <button onClick={() => setSent(false)}
              className="block w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm">
              Try Different Email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
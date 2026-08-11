import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import logo from '../../assets/logo_utl.png'

function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await authAPI.verifyEmail(token)
        if (result.success) {
          // ✅ Auto login after verification
          localStorage.setItem('utl_token', result.token)
          localStorage.setItem('utl_current_user', JSON.stringify(result.user))
          setStatus('success')
          setMessage(result.message)
          // Redirect to dashboard after 3 seconds
          setTimeout(() => navigate('/dashboard'), 3000)
        }
      } catch (err) {
        setStatus('error')
        setMessage(err.message || 'Verification failed')
      }
    }
    verify()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 text-center border border-white/10 shadow-2xl">

        <img src={logo} alt="UTL" className="h-14 w-auto rounded-xl mx-auto mb-6" />

        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-black text-white mb-2">Verifying your email...</h2>
            <p className="text-gray-400 text-sm">Please wait a moment</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✅
            </div>
            <h2 className="text-xl font-black text-white mb-2">Email Verified!</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <p className="text-green-400 text-xs mb-6">Redirecting to dashboard in 3 seconds...</p>
            <Link to="/dashboard"
              className="block w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all text-sm">
              Go to Dashboard Now →
            </Link>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ❌
            </div>
            <h2 className="text-xl font-black text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <div className="space-y-3">
              <Link to="/signup"
                className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm">
                Create New Account
              </Link>
              <a href="https://wa.me/2348038786037"
                target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm">
                Contact Support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
import { useLocation, useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/logo_utl.png'

function VerifyEmailPending() {
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ Email passed from SignUp.jsx via navigate('/verify-email-pending', { state: { email } })
  const email = location.state?.email

  // ✅ If someone lands here directly (no state, e.g. refreshed page),
  // send them back to signup instead of showing a broken/empty page.
  if (!email) {
    navigate('/signup')
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-8 text-center">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="UTL Logo" className="h-12 w-auto rounded-lg" />
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-3xl">
          📧
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-black text-white mb-2">Check your email</h2>
        <p className="text-gray-400 text-sm mb-1">
          We've sent a verification link to
        </p>
        <p className="text-blue-400 font-semibold text-sm mb-6 break-all">
          {email}
        </p>

        <p className="text-gray-400 text-xs leading-relaxed mb-8">
          Click the link in that email to verify your account. Once verified,
          you'll be able to log in. Didn't get it? Check your spam folder,
          or wait a minute and refresh your inbox.
        </p>

        <Link
          to="/login"
          className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
        >
          Back to Login
        </Link>

        <p className="text-gray-500 text-xs mt-4">
          Wrong email?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up again
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailPending
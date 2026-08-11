import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo_utl.png'

function SignUpSuccess() {
  const location = useLocation()
  const email = location.state?.email || 'your email'

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 text-center border border-white/10 shadow-2xl">

        <img src={logo} alt="UTL" className="h-14 w-auto rounded-xl mx-auto mb-6" />

        <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          📧
        </div>

        <h1 className="text-2xl font-black text-white mb-3">Check Your Email!</h1>

        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          We sent a verification link to:
        </p>

        <p className="text-blue-400 font-bold text-sm mb-6 bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-2">
          {email}
        </p>

        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Click the link in the email to verify your account. The link expires in <strong className="text-white">24 hours.</strong>
        </p>

        <div className="space-y-3 mb-8 text-left">
          {[
            { step: '1', text: 'Open your email inbox' },
            { step: '2', text: 'Find the email from Ultimate Tech Lab' },
            { step: '3', text: 'Click "Verify My Email"' },
            { step: '4', text: 'Login to your account' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <p className="text-gray-300 text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link to="/login"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm">
            Go to Login
          </Link>
          <a href="https://wa.me/2348038786037?text=Hello! I need help verifying my UTL account."
            target="_blank" rel="noopener noreferrer"
            className="block w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm">
            Need Help? WhatsApp Us
          </a>
        </div>

        <p className="text-gray-500 text-xs mt-6">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  )
}

export default SignUpSuccess
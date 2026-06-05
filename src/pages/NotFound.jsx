import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function NotFound() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  // ✅ Auto redirect to home after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer)
          navigate('/')
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const quickLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Services', path: '/services', icon: '⚡' },
    { name: 'Shop', path: '/shop', icon: '🛒' },
    { name: 'Crypto', path: '/services/crypto', icon: '💰' },
    { name: 'Contact', path: '/contact', icon: '📞' },
    { name: 'AI Academy', path: '/ai-learning', icon: '🤖' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-2xl mx-auto">

        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[150px] sm:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 select-none">
            404
          </h1>
          {/* Floating emoji */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
            🚀
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-400 text-lg mb-3 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Countdown */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <p className="text-gray-400 text-sm">
            Redirecting to home in{' '}
            <span className="text-white font-bold">{countdown}</span>{' '}
            seconds...
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to="/"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95">
            Go to Homepage
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
            ← Go Back
          </button>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest font-semibold">
            Or visit one of these pages
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 rounded-xl transition-all hover:-translate-y-0.5"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-gray-300 text-xs font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* UTL branding */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Need help?{' '}
            <a
              href="https://wa.me/2348038786037"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default NotFound
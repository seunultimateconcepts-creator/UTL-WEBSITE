import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import logo from '../../assets/logo_utl.png'
import GoogleAuthButton from '../../components/GoogleAuthButton'
import FacebookAuthButton from "../../components/FacebookAuthButton";

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // ✅ LOGIN — calls the real backend login endpoint
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const result = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        localStorage.setItem('utl_token', result.token)
        localStorage.setItem('utl_current_user', JSON.stringify(result.user))

        // ✅ Redirect to where they were before login, or dashboard
        const redirect = localStorage.getItem('utl_redirect_after_login')
        localStorage.removeItem('utl_redirect_after_login')
        navigate(redirect || '/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

return (
    <div className="min-h-screen bg-[#0a0f2c] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-white/10">

        {/* Left Side — Branding */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600/20 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl" />
          </div>

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <img src={logo} alt="UTL Logo" className="h-12 w-auto rounded-lg" />
            <div>
              <div className="text-white font-black text-sm">ULTIMATE</div>
              <div className="text-green-400 font-bold text-[11px] tracking-widest">TECH LAB</div>
            </div>
          </div>

          {/* Middle */}
          <div className="relative space-y-5">
            <h1 className="text-3xl font-black text-white leading-tight">
              Welcome back to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Ultimate Tech Lab
              </span>
            </h1>
            <p className="text-gray-400">
              Sign in to access your dashboard, track projects and manage your orders.
            </p>
            <div className="space-y-3">
              {[
                '📊 View your project progress',
                '💬 Message our team directly',
                '🛒 Track your orders',
                '💰 Check crypto market updates',
              ].map((f) => (
                <p key={f} className="text-gray-300 text-sm">{f}</p>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: 'Happy Clients' },
              { value: '200+', label: 'Projects Done' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-white text-xl font-black">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side — Form */}
        <div className="flex flex-col justify-center p-8 lg:p-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <img src={logo} alt="UTL Logo" className="h-10 w-auto rounded-lg" />
            <div className="text-white font-black text-sm">ULTIMATE TECH LAB</div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-1">Welcome Back! 👋</h2>
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={formData.password} onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input type="checkbox" name="rememberMe" id="rememberMe"
                checked={formData.rememberMe} onChange={handleChange}
                className="w-4 h-4 accent-blue-600" />
              <label htmlFor="rememberMe" className="text-gray-400 text-sm">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social login */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button type="button"
                className="flex-1 h-11">
                <GoogleAuthButton />
              </button>
              <button type="button"
              className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[#0a0f2c] hover:bg-gray-50 transition-colors whitespace-nowrap">                <FacebookAuthButton className="flex-1 h-11"/>
              </button>
            </div>

          </form>

          <p className="text-gray-500 text-xs text-center mt-5">
            By signing in you agree to our{' '}
            <a href="#" className="text-blue-400 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
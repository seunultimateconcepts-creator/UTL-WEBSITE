/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import logo from '../../assets/logo_utl.png'

function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'client',
    agreeTerms: false,
  })

  // ✅ Account types users can register as
  const accountTypes = [
    {
      id: 'client',
      label: 'Client',
      desc: 'I want to hire services',
      icon: '👤',
    },
    {
      id: 'seller',
      label: 'Seller',
      desc: 'I want to sell products',
      icon: '🏪',
    },
    {
      id: 'learner',
      label: 'AI Learner',
      desc: 'I want to learn AI & Tech',
      icon: '🤖',
    },
    {
      id: 'crypto',
      label: 'Crypto Student',
      desc: 'I want to learn crypto trading',
      icon: '💰',
    },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // ✅ Validate step 1
  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name')
      return false
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.phone) {
      setError('Please enter your phone number')
      return false
    }
    setError('')
    return true
  }

  // ✅ Validate step 2
  const validateStep2 = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!formData.agreeTerms) {
      setError('Please agree to our terms and conditions')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

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
      // ✅ Save token and user to localStorage
      localStorage.setItem('utl_token', result.token)
      localStorage.setItem('utl_current_user', JSON.stringify(result.user))

      // ✅ Redirect to intended page or dashboard
      const redirect = localStorage.getItem('utl_redirect_after_login')
      localStorage.removeItem('utl_redirect_after_login')
      navigate(redirect || '/dashboard')
    }
  } catch (err) {
    setError(err.message || 'Invalid email or password')
    setLoading(false)
  }


    // ✅ Save user to localStorage for now
    // When backend is ready we'll replace this with API call
    const user = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      accountType: formData.accountType,
      createdAt: new Date().toISOString(),
      avatar: null,
    }

    // ✅ Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('utl_users') || '[]')
    const emailExists = existingUsers.find(u => u.email === formData.email)

    if (emailExists) {
      setError('An account with this email already exists')
      setLoading(false)
      return
    }

    // ✅ Save user with password (hashed in production)
    const userWithPassword = { ...user, password: formData.password }
    existingUsers.push(userWithPassword)
    localStorage.setItem('utl_users', JSON.stringify(existingUsers))

    // ✅ Log user in immediately after signup
    localStorage.setItem('utl_current_user', JSON.stringify(user))

    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
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
              Join thousands of clients on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Ultimate Tech Lab
              </span>
            </h1>
            <p className="text-gray-400">
              Get access to world-class web development, crypto services and shopping assistance all in one place.
            </p>
            <div className="space-y-3">
              {[
                '✅ Track your projects in real-time',
                '✅ Communicate directly with our team',
                '✅ Access live crypto market data',
                '✅ Order products from anywhere in the world',
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

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-1">Create Account</h2>
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                  {s === 1 ? 'Personal Info' : 'Security'}
                </span>
                {s < 2 && <div className={`w-8 h-px mx-1 ${step > s ? 'bg-blue-600' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Account type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Join as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {accountTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, accountType: type.id }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.accountType === type.id
                          ? 'border-blue-500 bg-blue-600/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl block mb-1">{type.icon}</span>
                      <span className="text-white text-sm font-bold block">{type.label}</span>
                      <span className="text-gray-400 text-xs">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    placeholder="Seun"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    placeholder="Olajide"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">WhatsApp / Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <button type="button" onClick={handleNext}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 text-sm">
                Continue →
              </button>

              <p className="text-center text-gray-500 text-xs">
                By continuing you agree to our{' '}
                <a href="#" className="text-blue-400 hover:underline">Terms</a> &{' '}
                <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              {/* Password strength */}
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">Password strength:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`h-1 flex-1 rounded-full transition-all ${
                      formData.password.length === 0 ? 'bg-white/10' :
                      formData.password.length < 6 && level <= 1 ? 'bg-red-500' :
                      formData.password.length < 8 && level <= 2 ? 'bg-yellow-500' :
                      formData.password.length < 12 && level <= 3 ? 'bg-blue-500' :
                      formData.password.length >= 12 && level <= 4 ? 'bg-green-500' :
                      'bg-white/10'
                    }`} />
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" name="agreeTerms" id="agreeTerms"
                  checked={formData.agreeTerms} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-blue-600" />
                <label htmlFor="agreeTerms" className="text-gray-400 text-xs leading-relaxed">
                  I agree to Ultimate Tech Lab's{' '}
                  <a href="#" className="text-blue-400 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition-all text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create Account 🎉'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default SignUp
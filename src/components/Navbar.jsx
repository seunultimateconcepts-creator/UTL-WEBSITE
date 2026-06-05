import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import logo from '../assets/logo_utl.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // ✅ Get current logged in user
  const getCurrentUser = () => {
    const user = localStorage.getItem('utl_current_user')
    return user ? JSON.parse(user) : null
  }
  const user = getCurrentUser()

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('utl_current_user')
    navigate('/')
    window.location.reload()
  }

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ✅ Close everything when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveDropdown(null)
    setIsOpen(false)
  }, [location.pathname])

  // ✅ Nav links — add new pages here
  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Services',
      path: '/services',
      dropdown: [
        { name: 'All Services', path: '/services', icon: '📋' },
        { name: 'Web Development', path: '/services/web-development', icon: '🖥️' },
        { name: 'Crypto Services', path: '/services/crypto', icon: '💰' },
        { name: 'Shopping Assistance', path: '/services/shopping', icon: '🛒' },
      ]
    },
    {
      name: 'About',
      path: '/about',
      dropdown: [
        { name: 'About UTL', path: '/about', icon: '📋' },
        { name: 'Who Are We', path: '/about/who-we-are', icon: '👥' },
        { name: 'Values & Updates', path: '/about/values', icon: '💎' },
        { name: 'Our Vision', path: '/about/vision', icon: '🎯' },
        { name: 'FAQs', path: '/about/faqs', icon: '❓' },
      ]
    },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'AI Academy', path: '/ai-learning' },
    { name: 'Contact', path: '/contact' },
  ]

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const isActive = (link) => {
    if (link.dropdown) return location.pathname.startsWith(link.path)
    return location.pathname === link.path
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f2c] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="UTL Logo" className="h-10 w-auto rounded-lg" />
            <div className="hidden sm:block">
              <div className="text-white font-black text-xs leading-tight">ULTIMATE</div>
              <div className="text-green-400 font-bold text-[10px] tracking-widest">TECH LAB</div>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(link)
                          ? 'text-blue-400 bg-blue-600/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                      <span className={`text-[10px] transition-transform duration-200 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`}>▾</span>
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === link.name && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-white/5 last:border-0 transition-colors ${
                              location.pathname === item.path
                                ? 'text-blue-400 bg-blue-600/10'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span>{item.icon}</span>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link)
                        ? 'text-blue-400 bg-blue-600/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* ── Desktop Auth / Profile ── */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              // ✅ Logged in — show profile avatar
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('profile')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors border border-white/10"
                >
                  {/* Avatar initials */}
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-white text-xs font-semibold leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-400 text-[10px] capitalize">{user.accountType}</p>
                  </div>
                  <span className={`text-gray-400 text-[10px] transition-transform duration-200 ${
                    activeDropdown === 'profile' ? 'rotate-180' : ''
                  }`}>▾</span>
                </button>

                {/* Profile Dropdown */}
                {activeDropdown === 'profile' && (
                  <div className="absolute top-full right-0 mt-1 w-52 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">{user.firstName} {user.lastName}</p>
                          <p className="text-gray-400 text-[10px]">{user.email}</p>
                        </div>
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        user.accountType === 'seller' ? 'bg-orange-100 text-orange-700' :
                        user.accountType === 'learner' ? 'bg-purple-100 text-purple-700' :
                        user.accountType === 'crypto' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.accountType === 'client' ? '👤 Client' :
                         user.accountType === 'seller' ? '🏪 Seller' :
                         user.accountType === 'learner' ? '🤖 AI Learner' :
                         '💰 Crypto Student'}
                      </span>
                    </div>

                    {/* Menu items */}
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      📊 Dashboard
                    </Link>
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      🛒 My Orders
                    </Link>
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      🎓 Mentorship
                    </Link>
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      ⚙️ Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-white hover:bg-red-600 transition-colors">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ✅ Not logged in — show auth buttons
              <>
                <Link to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5">
                  Sign In
                </Link>
                <Link to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Burger ── */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1530] border-t border-white/10 px-4 py-4 space-y-1">

          {/* Mobile user info if logged in */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-3">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div>
                <p className="text-white text-sm font-bold">{user.firstName} {user.lastName}</p>
                <p className="text-gray-400 text-xs capitalize">{user.accountType}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive(link)
                        ? 'text-blue-400 bg-blue-600/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className={`text-xs transition-transform duration-200 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`}>▾</span>
                  </button>

                  {activeDropdown === link.name && (
                    <div className="ml-3 mt-1 mb-2 border-l-2 border-blue-600/30 pl-3 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                            location.pathname === item.path
                              ? 'text-blue-400 bg-blue-600/10'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link)
                      ? 'text-blue-400 bg-blue-600/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile auth buttons */}
          <div className="flex gap-2 pt-3 border-t border-white/10 mt-3">
            {user ? (
              <>
                <Link to="/dashboard"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center">
                  📊 Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl text-center">
                  Sign In
                </Link>
                <Link to="/signup"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
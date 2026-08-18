import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import logo from '../assets/logo_utl.png'
import {
  ChevronDown, Menu, X, LayoutGrid, Monitor, TrendingUp, ShoppingCart,
  Users, Gem, Target, HelpCircle, LayoutDashboard, ShoppingBag,
  GraduationCap, Settings, LogOut, User, Store,
} from 'lucide-react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  // ✅ Separate ref for the profile menu — it lives OUTSIDE dropdownRef's
  //    wrapper, so click-outside detection needs its own boundary too.
  const profileDropdownRef = useRef(null)

  // ✅ Get current logged in user
  const getCurrentUser = () => {
    const user = localStorage.getItem('utl_current_user')
    return user ? JSON.parse(user) : null
  }
  const user = getCurrentUser()

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('utl_token')
    localStorage.removeItem('utl_current_user')
    navigate('/')
    window.location.reload()
  }

  // ✅ Close dropdown when clicking outside — now checks BOTH the nav-links
  //    dropdown container AND the profile dropdown container, since they're
  //    separate DOM subtrees.
  useEffect(() => {
    const handleClickOutside = (e) => {
      const outsideNavDropdown = !dropdownRef.current || !dropdownRef.current.contains(e.target)
      const outsideProfileDropdown = !profileDropdownRef.current || !profileDropdownRef.current.contains(e.target)

      if (outsideNavDropdown && outsideProfileDropdown) {
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

  // ✅ Nav links — add new pages here. Icon is a lucide-react component.
  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Services',
      path: '/services',
      dropdown: [
        { name: 'All Services', path: '/services', icon: LayoutGrid },
        { name: 'Web Development', path: '/services/web-development', icon: Monitor },
        { name: 'Crypto Services', path: '/services/crypto', icon: TrendingUp },
        { name: 'Shopping Assistance', path: '/services/shopping', icon: ShoppingCart },
      ]
    },
    {
      name: 'About',
      path: '/about',
      dropdown: [
        { name: 'About UTL', path: '/about', icon: LayoutGrid },
        { name: 'Who Are We', path: '/about/who-we-are', icon: Users },
        { name: 'Values & Updates', path: '/about/values', icon: Gem },
        { name: 'Our Vision', path: '/about/vision', icon: Target },
        { name: 'FAQs', path: '/about/faqs', icon: HelpCircle },
      ]
    },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'U Tech Hub', path: '/tech-hub' },
    { name: 'Contact', path: '/contact' },
  ]

  // ✅ Account type badge — icon + label + color, matches dashboard config
  const accountBadges = {
    client:  { icon: User,          label: 'Client',         color: 'bg-blue-100 text-blue-700' },
    seller:  { icon: Store,         label: 'Seller',         color: 'bg-orange-100 text-orange-700' },
    learner: { icon: GraduationCap, label: 'AI Learner',     color: 'bg-purple-100 text-purple-700' },
    crypto:  { icon: TrendingUp,    label: 'Crypto Student', color: 'bg-green-100 text-green-700' },
  }
  const badge = user ? (accountBadges[user.accountType] || accountBadges.client) : null

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const isActive = (link) => {
    if (link.dropdown) return location.pathname.startsWith(link.path)
    return location.pathname === link.path
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f2c]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="UTL Logo" className="h-10 w-auto rounded-lg" />
            <div className="hidden sm:block">
              <div className="text-white font-black text-xs leading-tight tracking-wide">ULTIMATE</div>
              <div className="text-amber-400 font-bold text-[10px] tracking-widest">TECH LAB</div>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(link)
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === link.name && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                        {link.dropdown.map((item) => {
                          const ItemIcon = item.icon
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-white/5 last:border-0 transition-colors ${
                                location.pathname === item.path
                                  ? 'text-amber-400 bg-amber-400/10'
                                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <ItemIcon size={16} className="flex-shrink-0" />
                              {item.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link)
                        ? 'text-amber-400 bg-amber-400/10'
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
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => toggleDropdown('profile')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors border border-white/10"
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-white text-xs font-semibold leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-400 text-[10px] capitalize">{user.accountType}</p>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-gray-400 transition-transform duration-200 ${
                      activeDropdown === 'profile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {activeDropdown === 'profile' && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">{user.firstName} {user.lastName}</p>
                          <p className="text-gray-400 text-[10px]">{user.email}</p>
                        </div>
                      </div>
                      {badge && (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                          <badge.icon size={11} />
                          {badge.label}
                        </span>
                      )}
                    </div>

                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      <ShoppingBag size={16} /> My Orders
                    </Link>
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      <GraduationCap size={16} /> Mentorship
                    </Link>
                    <Link to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-white hover:bg-red-600 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5">
                  Sign In
                </Link>
                <Link to="/signup"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] text-sm font-bold rounded-lg transition-all">
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
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1530] border-t border-white/10 px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">

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
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === link.name && (
                    <div className="ml-3 mt-1 mb-2 border-l-2 border-amber-400/30 pl-3 space-y-1">
                      {link.dropdown.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                              location.pathname === item.path
                                ? 'text-amber-400 bg-amber-400/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <ItemIcon size={15} />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link)
                      ? 'text-amber-400 bg-amber-400/10'
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center">
                  <LayoutDashboard size={16} /> Dashboard
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
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] text-sm font-bold rounded-xl text-center">
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
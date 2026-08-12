import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo_utl.png'
import { getDashboardConfig } from '../../config/dashboardConfig'
import {
  LayoutDashboard, Briefcase, ShoppingCart, Store, GraduationCap,
  TrendingUp, MessageCircle, Settings, Bell, Plus, FileText, Palette,
  Home, LogOut, User, Lock, Trash2, CheckCircle2, Bot,
} from 'lucide-react'

// ✅ Maps the icon-name strings from dashboardConfig.js to actual
// lucide-react components. Add new icons here as needed.
const ICONS = {
  LayoutDashboard, Briefcase, ShoppingCart, Store, GraduationCap,
  TrendingUp, MessageCircle, Settings, Bell, Plus, FileText, Palette,
  Home, LogOut, User, Lock, Trash2, CheckCircle2, Bot,
}

// ✅ Small helper so we can write <Icon name="Briefcase" /> anywhere
function Icon({ name, className = 'w-5 h-5' }) {
  const Component = ICONS[name]
  if (!Component) return null
  return <Component className={className} />
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // ✅ Check if user is logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(currentUser)
    // eslint-disable-next-line
    setUser(parsed)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('utl_token')
    localStorage.removeItem('utl_current_user')
    navigate('/')
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ✅ Everything below depends on account type — pulled from config
  const config = getDashboardConfig(user.accountType)
  const { tabs, stats, quickActions, showMentorship } = config

  const validTabIds = tabs.map(t => t.id)
  const currentTab = validTabIds.includes(activeTab) ? activeTab : 'overview'

  const tabTitles = {
    overview: `Welcome back, ${user.firstName}!`,
    projects: 'My Projects',
    orders: 'My Orders',
    myshop: 'My Shop',
    mentorship: showMentorship === 'crypto' ? 'Crypto Mentorship' : 'AI Mentorship',
    messages: 'Messages',
    settings: 'Account Settings',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0f2c] flex flex-col fixed h-full">

        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="UTL" className="h-10 w-auto rounded-lg" />
            <div>
              <div className="text-white font-black text-xs">ULTIMATE</div>
              <div className="text-green-400 font-bold text-[10px] tracking-widest">TECH LAB</div>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{user.firstName} {user.lastName}</p>
              <p className="text-gray-400 text-xs capitalize">{user.accountType}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
          >
            <Icon name="Home" className="w-4 h-4" /> Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-600 text-sm font-medium transition-all"
          >
            <Icon name="LogOut" className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {tabTitles[currentTab]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Icon name="Bell" className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {currentTab === 'overview' && (
          <div className="space-y-8">

            {/* Stats */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                    <Icon name={stat.icon} className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  action.isTab ? (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.isTab)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors text-left ${action.color}`}
                    >
                      <Icon name={action.icon} className="w-5 h-5" />
                      <span className="text-sm font-semibold">{action.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={action.label}
                      to={action.link}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${action.color}`}
                    >
                      <Icon name={action.icon} className="w-5 h-5" />
                      <span className="text-sm font-semibold">{action.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Account info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone },
                  { label: 'Account Type', value: user.accountType },
                  { label: 'Member Since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
                  { label: 'Account Status', value: 'Active' },
                ].map((info) => (
                  <div key={info.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">{info.label}</p>
                    <p className="text-gray-900 text-sm font-semibold capitalize flex items-center gap-1.5">
                      {info.label === 'Account Status' && <Icon name="CheckCircle2" className="w-4 h-4 text-green-500" />}
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Projects Tab — client only */}
        {currentTab === 'projects' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="Briefcase" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">You haven't started any projects with us yet. Let's change that!</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              Start a Project →
            </Link>
          </div>
        )}

        {/* Orders Tab — client only */}
        {currentTab === 'orders' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="ShoppingCart" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Browse our shop!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors"
            >
              Browse Shop →
            </Link>
          </div>
        )}

        {/* My Shop Tab — seller only */}
        {currentTab === 'myshop' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="Store" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Products Listed Yet</h3>
            <p className="text-gray-500 mb-6">Start listing products to sell on Ultimate Tech Lab.</p>
            <a
              href="https://wa.me/2348038786037?text=Hello! I want to list a product to sell on UTL Shop."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              List a Product →
            </a>
          </div>
        )}

        {/* Mentorship Tab */}
        {currentTab === 'mentorship' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-1 max-w-xl gap-6">

              {/* Crypto Mentorship — crypto accounts only */}
              {showMentorship === 'crypto' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                    <Icon name="TrendingUp" className="w-10 h-10 text-white mb-3" />
                    <h3 className="text-white font-black text-xl mb-1">Crypto Mentorship</h3>
                    <p className="text-green-100 text-sm">Learn crypto trading from scratch</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Get personalized crypto trading mentorship from Oluwaseun — covering chart reading, P2P trading, risk management and building a profitable trading strategy.
                    </p>
                    <ul className="space-y-2">
                      {['Chart reading & analysis', 'P2P trading strategies', 'Risk management', 'Market psychology', 'Building a trading plan'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="CheckCircle2" className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 space-y-2">
                      <a
                        href={`https://wa.me/2348038786037?text=Hello! I want to enroll for Crypto Mentorship. My name is ${user.firstName} ${user.lastName} and my email is ${user.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all text-sm"
                      >
                        Enroll via WhatsApp
                      </a>
                      <a
                        href={`mailto:seunultimateconcepts@gmail.com?subject=Crypto Mentorship Enrollment&body=Hello! I want to enroll for Crypto Mentorship.%0D%0A%0D%0AName: ${user.firstName} ${user.lastName}%0D%0AEmail: ${user.email}%0D%0APhone: ${user.phone}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-sm"
                      >
                        Enroll via Email
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Mentorship — learner accounts only */}
              {showMentorship === 'ai' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6">
                    <Icon name="GraduationCap" className="w-10 h-10 text-white mb-3" />
                    <h3 className="text-white font-black text-xl mb-1">AI Mentorship</h3>
                    <p className="text-purple-100 text-sm">Learn AI with Claude — the world's best AI</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Learn AI from scratch with Claude as your personal tutor. Ask questions, build projects and master prompt engineering in a structured program designed by our expert team.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white">
                          <Icon name="Bot" className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-gray-900 text-xs font-bold">Claude AI Tutor</p>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-500 text-[10px]">Online</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs bg-white rounded-lg p-3 border border-gray-100">
                        Hi {user.firstName}! I'm Claude, your AI tutor. Ask me anything about AI, prompt engineering or building AI apps. I'm here to help you become an AI expert!
                      </p>
                    </div>
                    <div className="space-y-2">
                      <a
                        href={`https://wa.me/2348038786037?text=Hello! I want to enroll for AI Mentorship. My name is ${user.firstName} ${user.lastName} and my email is ${user.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all text-sm"
                      >
                        Enroll via WhatsApp
                      </a>
                      <a
                        href={`mailto:seunultimateconcepts@gmail.com?subject=AI Mentorship Enrollment&body=Hello! I want to enroll for AI Mentorship.%0D%0A%0D%0AName: ${user.firstName} ${user.lastName}%0D%0AEmail: ${user.email}%0D%0APhone: ${user.phone}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-sm"
                      >
                        Enroll via Email
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-blue-700 text-sm font-semibold mb-1">How Mentorship Works</p>
              <p className="text-blue-600 text-sm leading-relaxed">
                Click "Enroll via WhatsApp" or "Enroll via Email" — your details are automatically sent to our team.
                We'll reach out within 24 hours to schedule your first session and share your learning materials!
              </p>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {currentTab === 'messages' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Icon name="MessageCircle" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-gray-500 mb-6">Your messages with our team will appear here.</p>
            <a
              href="https://wa.me/2348038786037"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors"
            >
              Chat on WhatsApp →
            </a>
          </div>
        )}

        {/* Settings Tab */}
        {currentTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-6">Account Settings</h3>
            <div className="space-y-4">
              {[
                { label: 'Edit Profile', desc: 'Update your name, email and phone', icon: 'User' },
                { label: 'Change Password', desc: 'Update your account password', icon: 'Lock' },
                { label: 'Notifications', desc: 'Manage your notification preferences', icon: 'Bell' },
                { label: 'Delete Account', desc: 'Permanently delete your account', icon: 'Trash2', danger: true },
              ].map((setting) => (
                <button
                  key={setting.label}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    setting.danger
                      ? 'border-red-100 hover:bg-red-50 text-red-600'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={setting.icon} className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{setting.label}</p>
                      <p className="text-gray-400 text-xs">{setting.desc}</p>
                    </div>
                  </div>
                  <span className="text-gray-300">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
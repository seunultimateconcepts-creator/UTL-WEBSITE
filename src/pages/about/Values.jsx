import { Link } from 'react-router-dom'
import {
  Gem, ShieldCheck, Zap, Handshake, Globe, TrendingUp, Bot,
  ShoppingBag, Award, LineChart, GraduationCap, Sparkles,
} from 'lucide-react'

function Values() {

  const values = [
    { icon: Gem, title: 'Excellence', color: 'bg-amber-50 border-amber-100', iconColor: 'text-amber-600', desc: 'We deliver nothing short of the best in every project, trade and order we handle.' },
    { icon: ShieldCheck, title: 'Integrity', color: 'bg-green-50 border-green-100', iconColor: 'text-green-600', desc: 'We are honest, transparent and trustworthy in all our dealings with clients.' },
    { icon: Zap, title: 'Innovation', color: 'bg-yellow-50 border-yellow-100', iconColor: 'text-yellow-600', desc: 'We always use the latest technology and approaches to solve problems creatively.' },
    { icon: Handshake, title: 'Partnership', color: 'bg-purple-50 border-purple-100', iconColor: 'text-purple-600', desc: 'We treat every client as a long-term partner, not just a one-time transaction.' },
    { icon: Globe, title: 'Global Mindset', color: 'bg-orange-50 border-orange-100', iconColor: 'text-orange-600', desc: 'Built in Nigeria but designed to serve clients and businesses worldwide.' },
    { icon: TrendingUp, title: 'Growth', color: 'bg-pink-50 border-pink-100', iconColor: 'text-pink-600', desc: 'We are committed to growing with our clients and continuously improving our services.' },
  ]

  const updates = [
    { date: 'May 2026', type: 'Feature', color: 'bg-amber-100 text-amber-700', icon: Bot, title: 'UTL AI Chatbot Launched', desc: 'We launched our AI-powered chatbot to help clients get instant answers about our services.' },
    { date: 'April 2026', type: 'Service', color: 'bg-green-100 text-green-700', icon: ShoppingBag, title: 'UTL Shop Marketplace Launched', desc: 'Our shopping marketplace went live — now sellers can list products and customers can order from multiple stores.' },
    { date: 'March 2026', type: 'Milestone', color: 'bg-purple-100 text-purple-700', icon: Award, title: '500+ Happy Clients', desc: 'We hit a major milestone of 500 satisfied clients across web development, crypto and shopping services.' },
    { date: 'February 2026', type: 'Feature', color: 'bg-orange-100 text-orange-700', icon: LineChart, title: 'Live Market Tracker Added', desc: 'Real-time crypto prices and currency rates now available directly on our website.' },
    { date: 'January 2026', type: 'Service', color: 'bg-pink-100 text-pink-700', icon: GraduationCap, title: 'Crypto Mentorship Program', desc: 'Launched our structured crypto mentorship program helping beginners become confident traders.' },
    { date: 'December 2025', type: 'Milestone', color: 'bg-yellow-100 text-yellow-700', icon: Sparkles, title: 'Ultimate Tech Lab Rebranded', desc: 'Officially rebranded from a freelance service to Ultimate Tech Lab — a full digital solutions platform.' },
  ]

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/about" className="hover:text-white">About</Link>
            <span>›</span>
            <span className="text-amber-400">Values & Updates</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 text-xs font-medium tracking-wide">VALUES & UPDATES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              What We Stand For &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-500">
                Latest Updates
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Our core values guide everything we do. Stay updated with the latest news and milestones from Ultimate Tech Lab.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">OUR VALUES</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Core Values</h2>
            <p className="text-gray-500 max-w-md mx-auto">The principles that guide every decision we make at Ultimate Tech Lab.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title}
                className={`group border rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${value.color}`}>
                <value.icon size={32} className={`${value.iconColor} mb-4`} />
                <h3 className="text-gray-900 font-bold text-xl mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">LATEST NEWS</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Updates & Milestones</h2>
            <p className="text-gray-500 max-w-md mx-auto">Stay up to date with everything happening at Ultimate Tech Lab.</p>
          </div>
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all flex gap-5">
                <div className="flex-shrink-0 w-16 flex flex-col items-center text-center gap-2">
                  <update.icon size={20} className="text-amber-500" />
                  <p className="text-amber-600 text-[10px] font-bold">{update.date}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${update.color}`}>
                      {update.type}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1">{update.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{update.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back nav */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-4">
          <Link to="/about"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
            ← Back to About
          </Link>
          <Link to="/about/vision"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors">
            Our Vision →
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Values
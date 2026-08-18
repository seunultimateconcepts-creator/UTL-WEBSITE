import { Link } from 'react-router-dom'
import { Globe, Lightbulb, GraduationCap, Handshake, Check } from 'lucide-react'

function Vision() {

  const visionPoints = [
    { icon: Globe, title: 'Global Digital Solutions Brand', desc: 'To become the most trusted digital solutions brand in Africa and a recognized name globally — serving clients from Lagos to London, Abuja to Amsterdam.' },
    { icon: Lightbulb, title: 'One Platform for Everything Digital', desc: 'A single platform where businesses and individuals can get websites built, trade crypto safely, shop globally and manage their digital presence all in one place.' },
    { icon: GraduationCap, title: 'Empowering the Next Generation', desc: 'Training and mentoring the next generation of Nigerian developers and crypto traders — helping young Africans build skills and create wealth through technology.' },
    { icon: Handshake, title: 'Creating Opportunities', desc: 'Building a marketplace that creates income opportunities for local sellers, freelancers and entrepreneurs — using technology to level the playing field.' },
  ]

  const roadmap = [
    { phase: 'Phase 1', status: 'completed', title: 'Frontend Foundation', items: ['Beautiful website', 'Service pages', 'Market tracker', 'UTL AI chatbot'] },
    { phase: 'Phase 2', status: 'active', title: 'Full Platform', items: ['User authentication', 'Client dashboard', 'Order management', 'Email notifications'] },
    { phase: 'Phase 3', status: 'upcoming', title: 'Backend & APIs', items: ['Node.js backend', 'MongoDB database', 'REST APIs', 'Payment integration'] },
    { phase: 'Phase 4', status: 'upcoming', title: 'SaaS & Scale', items: ['Role-based access', 'Analytics dashboard', 'Subscription system', 'Mobile app'] },
  ]

  const statusStyles = {
    completed: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700', label: 'Completed' },
    active: { dot: 'bg-amber-500 animate-pulse', badge: 'bg-amber-100 text-amber-700', label: 'In Progress' },
    upcoming: { dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500', label: 'Coming Soon' },
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/about" className="hover:text-white">About</Link>
            <span>›</span>
            <span className="text-amber-400">Our Vision</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 text-xs font-medium tracking-wide">OUR VISION</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Where We Are{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-500">
                Headed
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our vision is bold — to build the most trusted digital solutions platform in Africa and eventually the world. Here's our roadmap to get there.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">THE VISION</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Big Picture</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {visionPoints.map((point) => (
              <div key={point.title}
                className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <point.icon size={22} className="text-amber-600" />
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-3">{point.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">ROADMAP</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Development Roadmap</h2>
            <p className="text-gray-500 max-w-md mx-auto">Our step by step plan to build Ultimate Tech Lab into a world-class platform.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {roadmap.map((phase) => {
              const style = statusStyles[phase.status]
              return (
                <div key={phase.phase}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                    phase.status === 'active' ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-gray-100'
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                      <span className="text-gray-400 text-xs font-bold uppercase">{phase.phase}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-black text-lg mb-4">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'active' ? 'bg-amber-500' : 'bg-gray-300'
                        }`}>
                          <Check size={11} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Back nav */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-4">
          <Link to="/about/values"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
            ← Values & Updates
          </Link>
          <Link to="/about/faqs"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors">
            FAQs →
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Vision
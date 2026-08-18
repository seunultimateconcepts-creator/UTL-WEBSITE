import { Link } from 'react-router-dom'
import {
  Monitor, Coins, ShoppingCart, Smile, Rocket, CalendarDays, Star,
  MessageCircle, FileText, CreditCard, PackageCheck, ArrowRight,
  ArrowDown,
} from 'lucide-react'

function Services() {

  const services = [
    {
      icon: Monitor,
      title: 'Web Development',
      desc: 'From simple landing pages to complex full stack web applications. We build fast, scalable and beautiful websites tailored to your business needs.',
      features: ['Frontend Development', 'Backend Development', 'Full Stack Solutions', 'API Development', 'E-Commerce Websites', 'Responsive Design'],
      path: '/services/web-development',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      btn: 'bg-blue-600 hover:bg-blue-500',
      iconColor: 'text-blue-600',
    },
    {
      icon: Coins,
      title: 'Crypto Services',
      desc: 'Buy, sell and trade cryptocurrencies safely at the best rates. We also mentor complete beginners to become confident and profitable traders.',
      features: ['Buy & Sell Crypto', 'P2P Trading', 'Best Market Rates', 'Mentorship & Training', 'Market Analysis', 'Portfolio Guidance'],
      path: '/services/crypto',
      bg: 'bg-green-50',
      border: 'border-green-100',
      btn: 'bg-green-600 hover:bg-green-500',
      iconColor: 'text-green-600',
    },
    {
      icon: ShoppingCart,
      title: 'Shopping Assistance',
      desc: 'Shop from any online store worldwide — Jumia, Amazon, AliExpress and more. We handle the order and deliver straight to your doorstep in Nigeria.',
      features: ['Jumia Orders', 'Amazon & AliExpress', 'International Shopping', 'Doorstep Delivery', 'Package Tracking', 'All 36 States'],
      path: '/services/shopping',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      btn: 'bg-orange-500 hover:bg-orange-400 text-white',
      iconColor: 'text-orange-600',
    },
  ]

  const stats = [
    { value: '500+', label: 'Happy Clients', icon: Smile },
    { value: '200+', label: 'Projects Completed', icon: Rocket },
    { value: '3+', label: 'Years Experience', icon: CalendarDays },
    { value: '99%', label: 'Client Satisfaction', icon: Star },
  ]

  const process = [
    { number: '01', title: 'Contact Us', desc: 'Reach out via WhatsApp or fill our contact form.', icon: MessageCircle },
    { number: '02', title: 'Get a Quote', desc: 'We provide the best rate for your specific needs.', icon: FileText },
    { number: '03', title: 'Make Payment', desc: 'Secure payment through trusted methods.', icon: CreditCard },
    { number: '04', title: 'Receive & Enjoy', desc: 'We deliver and ensure you are satisfied.', icon: PackageCheck },
  ]

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-amber-400">Services</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-300 text-xs font-medium tracking-wide">WHAT WE OFFER</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            All Your Digital Needs,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-500">
              One Trusted Platform
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            We provide world-class web development, secure crypto trading and seamless shopping assistance — all under one roof.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Get Started <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-[#0a0f2c] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={26} className="mx-auto mb-2 text-amber-400" />
                <p className="text-white text-4xl font-black mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">OUR SERVICES</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-500 max-w-md mx-auto">Choose a service below to learn more and get started.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title}
                className={`group bg-white border-2 ${service.border} rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}>
                <div className={`w-16 h-16 ${service.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <service.icon size={30} className={service.iconColor} />
                </div>
                <h3 className="text-gray-900 font-black text-2xl mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0 ${service.btn.split(' ')[0]}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={service.path}
                  className={`flex items-center justify-center gap-2 w-full py-3 ${service.btn} font-bold rounded-xl text-center transition-all hover:-translate-y-0.5 text-sm`}>
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">HOW IT WORKS</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Simple Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-amber-200" />
            {process.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border-2 border-amber-100 shadow-md flex flex-col items-center justify-center mb-5">
                  <step.icon size={22} className="text-amber-600 mb-0.5" />
                  <span className="text-amber-600 font-black text-[10px]">{step.number}</span>
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                {index < process.length - 1 && (
                  <ArrowDown size={20} className="md:hidden text-amber-300 mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-8">
            Choose a service above or contact us and we'll guide you through everything!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/contact"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Services
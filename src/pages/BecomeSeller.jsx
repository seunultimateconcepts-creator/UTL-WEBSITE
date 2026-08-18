import { useState } from 'react'
import {
  Store, Globe, Wallet, ShieldCheck, MessageCircle, Zap, Gem,
  PartyPopper, Send, Check, ArrowRight,
} from 'lucide-react'

function BecomeSeller() {

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    whatsapp: '',
    email: '',
    category: '',
    productCount: '',
    description: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const categories = [
    'Phones & Tablets',
    'Laptops & Computers',
    'Fashion & Clothing',
    'Electronics',
    'Home & Kitchen',
    'Gaming',
    'Beauty & Personal Care',
    'Food & Groceries',
    'Sports & Fitness',
    'Books & Stationery',
    'Other',
  ]

  const benefits = [
    { icon: Globe, title: 'Wide Reach', desc: 'Access thousands of customers visiting Ultimate Tech Lab daily.' },
    { icon: Wallet, title: 'More Sales', desc: 'Our growing traffic means more eyes on your products.' },
    { icon: ShieldCheck, title: 'Trusted Platform', desc: 'Customers trust UTL — that trust extends to your products.' },
    { icon: MessageCircle, title: 'WhatsApp Orders', desc: 'Customers contact you directly — no middleman on orders.' },
    { icon: Zap, title: 'Quick Setup', desc: 'Get listed in less than 24 hours after approval.' },
    { icon: Gem, title: 'Free to Start', desc: 'List your first 3 products completely free.' },
  ]

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      borderColor: 'border-gray-200',
      btnClass: 'bg-gray-800 hover:bg-gray-700 text-white',
      featured: false,
      features: [
        'Up to 3 products',
        'Your WhatsApp on listings',
        'Basic category listing',
        'UTL support',
      ],
    },
    {
      name: 'Growth',
      price: '₦5,000',
      period: 'per month',
      borderColor: 'border-amber-400',
      btnClass: 'bg-amber-500 hover:bg-amber-400 text-[#0a0f2c]',
      featured: true,
      features: [
        'Up to 20 products',
        'Featured badge on products',
        'Priority listing placement',
        'Your WhatsApp on listings',
        'Monthly analytics report',
      ],
    },
    {
      name: 'Premium',
      price: '₦15,000',
      period: 'per month',
      borderColor: 'border-orange-400',
      btnClass: 'bg-orange-500 hover:bg-orange-400 text-white',
      featured: false,
      features: [
        'Unlimited products',
        'Top of search placement',
        'Featured on homepage',
        'Social media promotion',
        'Dedicated support',
        'Weekly analytics report',
      ],
    },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = `🏪 New Seller Application!\n\nFull Name: ${formData.fullName}\nBusiness Name: ${formData.businessName}\nWhatsApp: ${formData.whatsapp}\nEmail: ${formData.email}\nCategory: ${formData.category}\nNumber of Products: ${formData.productCount}\n\nAbout Business:\n${formData.description}`
    window.open(`https://wa.me/2348038786037?text=${encodeURIComponent(message)}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <Store size={13} className="text-orange-300" />
            <span className="text-orange-300 text-xs font-medium tracking-wide">
              SELL ON UTL
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Grow Your Business{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              With Us
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join Ultimate Tech Lab marketplace and reach thousands of customers. List your products and start selling today!
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Apply Now — It's Free <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/2348038786037?text=Hello! I want to sell on UTL Shop"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">
              WHY SELL WITH US
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Benefits of Selling on UTL
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Everything you need to grow your business online.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <benefit.icon size={22} className="text-orange-600" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">
              PRICING
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Simple Pricing Plans
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Start free and upgrade as your business grows.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 border-2 ${plan.borderColor} relative ${plan.featured ? 'shadow-xl scale-105' : 'shadow-sm'}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-[#0a0f2c] text-xs font-bold px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-gray-900 font-black text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className={`block w-full py-3 font-bold rounded-xl text-center text-sm transition-all hover:-translate-y-0.5 ${plan.btnClass}`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">
              GET STARTED
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Apply to Sell on UTL
            </h2>
            <p className="text-gray-500">
              Fill in the form and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <PartyPopper size={56} className="mx-auto mb-4 text-orange-500" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">Application Sent!</h3>
                <p className="text-gray-500 mb-2">
                  Your seller application has been sent to our WhatsApp.
                </p>
                <p className="text-gray-500 mb-6">
                  We'll review and get back to you within 24 hours!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-400 transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your business or brand name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Product Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Number of Products *
                    </label>
                    <select
                      name="productCount"
                      required
                      value={formData.productCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                    >
                      <option value="">Select range</option>
                      <option value="1-5">1 - 5 products</option>
                      <option value="6-20">6 - 20 products</option>
                      <option value="21-50">21 - 50 products</option>
                      <option value="50+">50+ products</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tell us about your business *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what you sell, your location and anything else we should know..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
                >
                  <Send size={16} /> Submit Application via WhatsApp
                </button>

                <p className="text-gray-400 text-xs text-center">
                  Clicking submit opens WhatsApp with your application. We review within 24 hours!
                </p>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Questions about selling?
          </h2>
          <p className="text-gray-400 mb-8">
            Chat with us on WhatsApp and we'll answer everything!
          </p>
          <a
            href="https://wa.me/2348038786037?text=Hello! I have questions about selling on UTL Shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}

export default BecomeSeller
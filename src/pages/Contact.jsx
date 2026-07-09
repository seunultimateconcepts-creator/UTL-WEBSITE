import { useState } from 'react'

function Contact() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  // ✅ Services list for dropdown
  const services = [
    'Web Development',
    'Frontend Development',
    'Backend Development',
    'Full Stack Project',
    'Crypto Trading',
    'P2P Trading',
    'Crypto Mentorship',
    'Shopping Assistance',
    'Other',
  ]

  // ✅ Budget ranges
  const budgets = [
    'Under ₦50,000',
    '₦50,000 - ₦150,000',
    '₦150,000 - ₦500,000',
    '₦500,000+',
    'Let\'s discuss',
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ Format message for WhatsApp
    const message = `
Hello Ultimate Tech Lab! 👋

*New Project Inquiry*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Service Needed:* ${formData.service}
*Budget:* ${formData.budget}

*Message:*
${formData.message}
    `.trim()

    // ✅ Opens WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/2348038786037?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-xs font-medium tracking-wide">GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Let's Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Together
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Tell us about your project and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Left — Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Contact Info</h2>
                <p className="text-gray-500 text-sm">Reach out through any of these channels.</p>
              </div>

              {/* Contact cards */}
              {[
                { icon: '📱', title: 'WhatsApp', value: '+234 803 878 6037', link: 'https://wa.me/2348038786037', color: 'bg-green-50 border-green-100' },
                { icon: '✉️', title: 'Email', value: 'hello@ultimatetechlab.com', link: 'mailto:hello@ultimatetechlab.com', color: 'bg-blue-50 border-blue-100' },
                { icon: '📍', title: 'Location', value: 'Edo, Nigeria', link: null, color: 'bg-orange-50 border-orange-100' },
                { icon: '🕐', title: 'Working Hours', value: 'Mon–Sat: 9AM–8PM', link: null, color: 'bg-purple-50 border-purple-100' },
              ].map((item) => (
                <div key={item.title} className={`flex items-start gap-4 p-4 rounded-2xl border ${item.color}`}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{item.title}</p>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="text-gray-900 font-semibold text-sm hover:text-blue-600 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-semibold text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { name: 'Instagram', url: 'https://www.instagram.com/seun_ultimate', icon: '📸' },
                    { name: 'Twitter', url: 'https://x.com/U_Tech_Lab', icon: '𝕏' },
                    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/oluwaseun-olajide-594841228', icon: 'in' },
                    { name: 'YouTube', url: 'https://youtube.com/@makanjuoladavid8349', icon: '▶' },
                  ].map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all text-sm font-bold">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {submitted ? (
                  // ✅ Success message after form submit
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 mb-6">
                      Your inquiry has been sent to our WhatsApp. We'll get back to you shortly!
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Start a Project</h2>

                    {/* Name + Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Service + Budget */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Service Needed *
                        </label>
                        <select
                          name="service"
                          required
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        >
                          <option value="">Select a service</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Budget Range
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        >
                          <option value="">Select budget</option>
                          {budgets.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Tell us about your project *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your project, what you need and any other details..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
                    >
                      Send Message via WhatsApp 📱
                    </button>

                    <p className="text-gray-400 text-xs text-center">
                      Clicking send will open WhatsApp with your message pre-filled. We respond within 1 hour during working hours.
                    </p>

                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default Contact
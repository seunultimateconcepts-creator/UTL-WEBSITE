import { Link } from 'react-router-dom'

function WebDevelopment() {

  // ✅ Tech stack you work with — add/remove as your skills grow
  const technologies = [
    { name: 'HTML5', icon: '🌐' },
    { name: 'CSS3', icon: '🎨' },
    { name: 'JavaScript', icon: '⚡' },
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'Tailwind CSS', icon: '💨' },
  ]

  // ✅ Services you offer under web development
  const services = [
    {
      icon: '🖥️',
      title: 'Frontend Development',
      desc: 'Beautiful, responsive and fast user interfaces built with React and modern CSS frameworks.',
    },
    {
      icon: '⚙️',
      title: 'Backend Development',
      desc: 'Robust server-side applications, REST APIs and database architecture using Node.js.',
    },
    {
      icon: '🔗',
      title: 'Full Stack Solutions',
      desc: 'End-to-end web applications from database to user interface, all handled by us.',
    },
    {
      icon: '🛒',
      title: 'E-Commerce Websites',
      desc: 'Online stores with payment integration, product management and order tracking.',
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      desc: 'Websites that look and work perfectly on mobile, tablet and desktop screens.',
    },
    {
      icon: '🔌',
      title: 'API Integration',
      desc: 'Connect your website to third party services like payment gateways, maps and more.',
    },
  ]

  // ✅ Why choose UTL for web development
  const whyUs = [
    { icon: '⚡', title: 'Fast Delivery', desc: 'We deliver projects on time without compromising quality.' },
    { icon: '💎', title: 'Quality Code', desc: 'Clean, scalable and well documented code for easy maintenance.' },
    { icon: '📞', title: '24/7 Support', desc: 'We are always available to support you after delivery.' },
    { icon: '💰', title: 'Affordable Rates', desc: 'Premium quality at prices that work for your budget.' },
  ]

  // ✅ Process steps
  const process = [
    { number: '01', title: 'Consultation', desc: 'We discuss your project needs, goals and budget.' },
    { number: '02', title: 'Planning & Design', desc: 'We create a plan and design mockup for your approval.' },
    { number: '03', title: 'Development', desc: 'We build your website with clean modern code.' },
    { number: '04', title: 'Testing', desc: 'We test thoroughly on all devices and browsers.' },
    { number: '05', title: 'Launch', desc: 'We deploy your website and hand it over to you.' },
    { number: '06', title: 'Support', desc: 'We provide ongoing support and maintenance.' },
  ]

  return (
    <div className="pt-16">

      {/* ── Hero Banner ── */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>›</span>
            <span className="text-blue-400">Web Development</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5">
                <span className="text-blue-300 text-xs font-medium tracking-wide">WEB DEVELOPMENT</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                We Build Stunning{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Websites & Apps
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                From simple landing pages to complex web applications, we build fast, scalable and modern digital solutions tailored to your business needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/2348038786037"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                >
                  Start a Project
                </a>
                <Link
                  to="/portfolio"
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Right — Tech stack preview */}
            <div className="grid grid-cols-4 gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-white/10 hover:border-blue-500/30 transition-all"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-gray-300 text-xs font-medium text-center">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">WHAT WE OFFER</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Web Development Services</h2>
            <p className="text-gray-500 max-w-md mx-auto">Everything you need to build a powerful online presence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">HOW WE WORK</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Development Process</h2>
            <p className="text-gray-500 max-w-md mx-auto">A clear and transparent process from start to finish.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step) => (
              <div key={step.number} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">WHY CHOOSE US</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Why Ultimate Tech Lab?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {whyUs.map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to build your website?
          </h2>
          <p className="text-gray-400 mb-8">
            Let's discuss your project and bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/2348038786037"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Start a Project →
            </a>
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default WebDevelopment
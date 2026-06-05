import founderImage from '../assets/newabout.jpeg'
import { Link } from 'react-router-dom'

function About() {

  // ✅ Team/founder info — update here anytime
  const founder = {
    name: 'Oluwaseun Olajide',
    role: 'Founder & Full Stack Developer',
    image: founderImage, // ✅ Add your photo URL here later
    bio: 'Passionate about technology, crypto trading and helping individuals and businesses achieve their digital goals. With 3+ years of experience building modern web applications and trading crypto markets, I founded Ultimate Tech Lab to be a one-stop digital solutions platform for everyone.',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Crypto Trading', 'P2P Trading'],
    socials: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/oluwaseun-olajide-594841228', icon: 'in' },
      { name: 'Twitter', url: 'https://x.com/seun_ultimate', icon: '𝕏' },
      { name: 'Instagram', url: 'https://www.instagram.com/seun_ultimate', icon: '📸' },
      { name: 'YouTube', url: 'https://youtube.com/@makanjuoladavid8349', icon: '▶' },
    ],
  }

  // ✅ Company stats
  const stats = [
    { value: '500+', label: 'Happy Clients' },
    { value: '200+', label: 'Projects Completed' },
    { value: '3+', label: 'Years Experience' },
    { value: '99%', label: 'Client Satisfaction' },
  ]

  // ✅ Core values
  const values = [
    { icon: '💎', title: 'Excellence', desc: 'We deliver nothing short of the best in everything we do.' },
    { icon: '🔒', title: 'Integrity', desc: 'Honest, transparent and trustworthy in all our dealings.' },
    { icon: '⚡', title: 'Innovation', desc: 'Always using the latest technology to solve problems.' },
    { icon: '🤝', title: 'Partnership', desc: 'We treat every client as a long-term partner not just a customer.' },
    { icon: '🌍', title: 'Global Mindset', desc: 'Built for Nigeria but designed to serve the world.' },
    { icon: '📈', title: 'Growth', desc: 'We are committed to growing with our clients every step of the way.' },
  ]

  // ✅ Timeline — company journey
  const timeline = [
    { year: '2021', title: 'The Beginning', desc: 'Started as a freelance web developer and crypto trader in Lagos.' },
    { year: '2022', title: 'First Clients', desc: 'Built first 20 websites and started P2P crypto trading services.' },
    { year: '2023', title: 'Growing Fast', desc: 'Reached 100+ clients and launched shopping assistance service.' },
    { year: '2024', title: 'Ultimate Tech Lab', desc: 'Officially launched Ultimate Tech Lab as a full digital solutions brand.' },
    { year: '2025', title: 'Expanding', desc: 'Launched UTL Shop marketplace and onboarded 500+ clients.' },
    { year: '2026', title: 'Going Global', desc: 'Expanding services globally while maintaining our Nigerian roots.' },
  ]

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-blue-400">About</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-300 text-xs font-medium tracking-wide">ABOUT US</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                We Are{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Ultimate Tech Lab
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                We are passionate about using technology and digital solutions to make life easier for individuals and businesses. Our mission is to deliver reliable, secure and innovative services that empower our clients to achieve more in the digital world.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup"
  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
  Work With Us
</Link>
                <Link
                  to="/portfolio"
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                >
                  View Our Work
                </Link>
              </div>
            </div>

            {/* Right — Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
                >
                  <p className="text-white text-4xl font-black mb-2">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">THE FOUNDER</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Meet The Brain Behind UTL</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            {/* Photo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-2xl scale-110" />
                {founder.image? (
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="relative w-72 h-72 object-cover rounded-3xl shadow-2xl"
                  />
                ) : (
                  // ✅ Placeholder until you add your photo
                  <div className="relative w-72 h-72 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl flex items-center justify-center">
                    <span className="text-8xl">👨‍💻</span>
                  </div>
                )}
                {/* Online badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-gray-700 text-xs font-bold">Available for projects</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{founder.name}</h3>
                <p className="text-blue-600 font-semibold">{founder.role}</p>
              </div>

              <p className="text-gray-500 leading-relaxed">{founder.bio}</p>

              {/* Skills */}
              <div>
                <p className="text-gray-700 text-sm font-bold mb-3">Skills & Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {founder.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-gray-700 text-sm font-bold mb-3">Connect with me</p>
                <div className="flex gap-3">
                 
                  {founder.socials.map((social) => (
                    <a
                      key={social.name}
                      
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-500 transition-all text-sm font-bold"
                      >
                    
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Add photo note */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-blue-700 text-xs">
                  💡 <strong>To add your photo:</strong> Upload your image to the assets folder and update the <code>founder.image</code> value with the path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">WHAT WE STAND FOR</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-md mx-auto">The principles that guide everything we do at Ultimate Tech Lab.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">OUR STORY</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Journey So Far</h2>
            <p className="text-gray-500 max-w-md mx-auto">From a freelancer in Lagos to a growing digital solutions brand.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-100 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item,) => (
                <div key={item.year} className="flex gap-6 items-start">
                  {/* Year circle */}
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm relative z-10">
                    {item.year}
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                    <h3 className="text-gray-900 font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub pages links */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Learn More About Us</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Who Are We', desc: 'Our full story and background', path: '/about/who-we-are', icon: '👥' },
              { title: 'Values & Updates', desc: 'What we stand for and latest news', path: '/about/values', icon: '💎' },
              { title: 'Our Vision', desc: 'Where we are headed', path: '/about/vision', icon: '🎯' },
              { title: 'FAQs', desc: 'Answers to common questions', path: '/about/faqs', icon: '❓' },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-gray-900 font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
                <p className="text-blue-600 text-sm font-semibold mt-3 group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                  Learn More →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to work with us?
          </h2>
          <p className="text-gray-400 mb-8">
            Let's build something amazing together!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Start a Project →
            </Link>
            <a
              href="https://wa.me/2348038786037"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}

export default About
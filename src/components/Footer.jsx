import logo from '../assets/logo_utl.png'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Youtube, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  const contactInfo = {
    whatsapp: '+2348038786037',
    email: 'seunultimateconcepts@gmail.com',
    location: 'Edo, Nigeria',
    hours: 'Mon–Sat: 9AM–8PM',
  }

  // ✅ icon is now a lucide-react component — real brand glyphs, not emoji
  const socialLinks = [
    { name: 'YouTube', url: 'https://youtube.com/@makanjuoladavid8349', icon: Youtube },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/oluwaseun-olajide-594841228', icon: Linkedin },
    { name: 'Facebook', url: 'https://www.facebook.com/share/1HWXsT7c9p/', icon: Facebook },
    { name: 'Twitter', url: 'https://x.com/U_Tech_Lab', icon: Twitter },
    { name: 'Instagram', url: 'https://www.instagram.com/seun_ultimate', icon: Instagram },
  ]

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ]

  const services = [
    { name: 'Web Development', path: '/services/web-development' },
    { name: 'Frontend Development', path: '/services/web-development' },
    { name: 'Backend Development', path: '/services/web-development' },
    { name: 'Crypto Trading', path: '/services/crypto' },
    { name: 'P2P Trading', path: '/services/crypto' },
    { name: 'Shopping Assistance', path: '/services/shopping' },
  ]

  return (
    <footer className="bg-[#0a0f2c] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">

            <Link to="/" className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Ultimate Tech Lab Logo"
                className="h-12 w-auto rounded-lg"
              />
              <div>
                <div className="text-white font-black text-sm leading-tight tracking-wide">
                  ULTIMATE
                </div>
                <div className="text-amber-400 font-bold text-[11px] tracking-widest">
                  TECH LAB
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Building digital solutions for a global audience. We build, trade and deliver value with excellence.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-400 hover:text-green-400 transition-colors text-sm"
              >
                <Phone size={15} className="flex-shrink-0" />
                <span>{contactInfo.whatsapp}</span>
              </a>

              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2.5 text-gray-400 hover:text-amber-400 transition-colors text-sm"
              >
                <Mail size={15} className="flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </a>

              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <MapPin size={15} className="flex-shrink-0" />
                <span>{contactInfo.location}</span>
              </div>

              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <Clock size={15} className="flex-shrink-0" />
                <span>{contactInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 text-sm hover:text-amber-400 hover:translate-x-1 transition-all inline-block"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-gray-400 text-sm hover:text-amber-400 hover:translate-x-1 transition-all inline-block"
                  >
                    → {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest updates from Ultimate Tech Lab.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] text-sm font-bold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm">
            © {currentYear} Ultimate Tech Lab. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const SocialIcon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 flex items-center justify-center transition-all text-gray-400 hover:text-[#0a0f2c]"
                >
                  <SocialIcon size={16} />
                </a>
              )
            })}
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer

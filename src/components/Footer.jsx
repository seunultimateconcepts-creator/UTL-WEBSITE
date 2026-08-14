import logo from '../assets/logo_utl.png'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

// ✅ lucide-react removed brand/logo icons (trademark reasons), so social
// icons are small inline SVGs here instead — same approach as the
// WhatsApp icon already used elsewhere on the site.
const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/>
  </svg>
)
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2V9h3.5v1.6h.05c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.4H3.6V9h3.5v11.4Z"/>
  </svg>
)
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12Z"/>
  </svg>
)
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 2H22l-7.2 8.3L23.3 22h-6.6l-5.2-6.8L5.4 22H2.3l7.7-8.9L1 2h6.8l4.7 6.2L18.9 2Zm-1.2 18.1h1.7L7.4 3.8H5.6l12.1 16.3Z"/>
  </svg>
)
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

function Footer() {
  const currentYear = new Date().getFullYear()

  const contactInfo = {
    whatsapp: '+2348038786037',
    email: 'seunultimateconcepts@gmail.com',
    location: 'Edo, Nigeria',
    hours: 'Mon–Sat: 9AM–8PM',
  }

  const socialLinks = [
    { name: 'YouTube', url: 'https://youtube.com/@makanjuoladavid8349', icon: YoutubeIcon },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/oluwaseun-olajide-594841228', icon: LinkedinIcon },
    { name: 'Facebook', url: 'https://www.facebook.com/share/1HWXsT7c9p/', icon: FacebookIcon },
    { name: 'Twitter', url: 'https://x.com/U_Tech_Lab', icon: TwitterIcon },
    { name: 'Instagram', url: 'https://www.instagram.com/seun_ultimate', icon: InstagramIcon },
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
                  <SocialIcon className="w-4 h-4" />
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
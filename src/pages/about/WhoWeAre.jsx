import { Link } from 'react-router-dom'
import founderPhoto from '../../assets/newabout.jpeg'

function WhoWeAre() {

  const team = [
    {
      name: 'Oluwaseun Olajide',
      role: 'Founder & Full Stack Developer',
      bio: 'Passionate about technology and helping businesses grow online. 3+ years building modern web applications and trading crypto markets.',
      skills: ['React', 'Node.js', 'MongoDB', 'Crypto Trading'],
      photo: founderPhoto,
      socials: {
        twitter: 'https://x.com/U_Tech_Lab',
        linkedin: 'https://www.linkedin.com/in/oluwaseun-olajide-594841228',
        instagram: 'https://www.instagram.com/seun_ultimate',
      }
    },
  ]

  const story = [
    {
      icon: '🌱',
      title: 'How It Started',
      desc: 'Ultimate Tech Lab was born out of a simple idea — to make quality digital services accessible to everyone in Nigeria and beyond. What started as freelance web development quickly grew into a full digital solutions platform.',
    },
    {
      icon: '🎯',
      title: 'What Drives Us',
      desc: 'We are driven by the belief that technology should solve real problems. Every service we offer — web development, crypto trading or shopping assistance — is designed to make life easier and help our clients achieve more.',
    },
    {
      icon: '🌍',
      title: 'Where We Are Going',
      desc: 'We are building UTL into a world-class digital platform that serves not just Nigeria but the entire globe. Our goal is to be the most trusted one-stop digital solutions brand in Africa and beyond.',
    },
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
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/about" className="hover:text-white">About</Link>
            <span>›</span>
            <span className="text-blue-400">Who Are We</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-xs font-medium tracking-wide">WHO ARE WE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              The People Behind{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Ultimate Tech Lab
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              We are a passionate team of digital problem solvers based in Lagos, Nigeria — building solutions that work for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">OUR STORY</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">The UTL Story</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {story.map((item) => (
              <div key={item.title}
                className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-gray-900 font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">THE TEAM</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-500 max-w-md mx-auto">The passionate individuals behind Ultimate Tech Lab.</p>
          </div>
          <div className="flex justify-center">
            {team.map((member) => (
              <div key={member.name}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all max-w-sm w-full">
                <div className="h-64 overflow-hidden">
                  <img src={member.photo} alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 font-black text-xl mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {Object.entries(member.socials).map(([platform, url]) => (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-500 transition-all text-xs font-bold capitalize">
                        {platform[0].toUpperCase()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Join team CTA */}
          <div className="mt-12 text-center bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <h3 className="text-xl font-black text-gray-900 mb-2">Want to Join Our Team? 🚀</h3>
            <p className="text-gray-500 text-sm mb-4">We are always looking for talented developers, designers and crypto traders to collaborate with.</p>
            <a href="https://wa.me/2348038786037?text=Hello! I'd like to join the UTL team."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors text-sm">
              Get In Touch →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to work with us?</h2>
          <p className="text-gray-400 mb-8">Let's build something amazing together!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Start a Project →
            </Link>
            <Link to="/about"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              ← Back to About
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default WhoWeAre
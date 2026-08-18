import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Star, Lightbulb, Github, ArrowRight, Globe, Palette, Zap, Atom,
  Wind, Server, Leaf, Rocket, GitBranch, Plug, PenTool, Terminal,
} from 'lucide-react'

function Portfolio() {

  const [activeFilter, setActiveFilter] = useState('All')

  // ✅ Filter categories
  const filters = ['All', 'Web Development', 'UI/UX Design', 'Full Stack', 'Crypto Tools']

  // ✅ Portfolio projects — add your real projects here as you build them
  const projects = [
    {
      id: 1,
      title: 'Ultimate Tech Lab',
      category: 'Full Stack',
      desc: 'A full-stack digital solutions platform offering web development, crypto services and shopping assistance.',
      tags: ['React', 'Vite', 'Tailwind CSS', 'Node.js'],
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&q=80',
      link: '/',
      github: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'Crypto Market Tracker',
      category: 'Crypto Tools',
      desc: 'Live cryptocurrency price tracker with real-time data, currency conversion and market insights.',
      tags: ['React', 'CoinGecko API', 'Tailwind CSS'],
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=600&q=80',
      link: '/services/crypto',
      github: '#',
      featured: true,
    },
    {
      id: 3,
      title: 'E-Commerce Shop',
      category: 'Web Development',
      desc: 'A modern shopping platform with product filtering, search and WhatsApp order integration.',
      tags: ['React', 'Tailwind CSS', 'WhatsApp API'],
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
      link: '/shop',
      github: '#',
      featured: false,
    },
    {
      id: 4,
      title: 'Business Landing Page',
      category: 'UI/UX Design',
      desc: 'A clean and modern business landing page with hero section, services and contact form.',
      tags: ['React', 'Tailwind CSS', 'Framer Motion'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
      link: '#',
      github: '#',
      featured: false,
    },
    {
      id: 5,
      title: 'News Aggregator App',
      category: 'Full Stack',
      desc: 'A real-time news aggregator pulling live articles from multiple sources across different categories.',
      tags: ['React', 'GNews API', 'Tailwind CSS'],
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
      link: '/#news',
      github: '#',
      featured: false,
    },
    {
      id: 6,
      title: 'Developer Portfolio',
      category: 'UI/UX Design',
      desc: 'A personal portfolio website showcasing projects, skills and professional experience.',
      tags: ['React', 'Tailwind CSS', 'Vite'],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
      link: '/about',
      github: '#',
      featured: false,
    },
  ]

  // ✅ Filter projects based on active category
  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  // ✅ Tech stack skills — amber replaces the old blue as the lead bar
  const skills = [
    { name: 'React', level: 90, color: 'bg-amber-500' },
    { name: 'JavaScript', level: 85, color: 'bg-yellow-500' },
    { name: 'Tailwind CSS', level: 92, color: 'bg-cyan-500' },
    { name: 'Node.js', level: 75, color: 'bg-green-500' },
    { name: 'MongoDB', level: 70, color: 'bg-emerald-500' },
    { name: 'HTML/CSS', level: 95, color: 'bg-orange-500' },
  ]

  // ✅ Tech stack icons — lucide-react, no emoji
  const techIcons = [
    { name: 'HTML5', icon: Globe, color: 'bg-orange-50 border-orange-100 text-orange-600' },
    { name: 'CSS3', icon: Palette, color: 'bg-blue-50 border-blue-100 text-blue-600' },
    { name: 'JavaScript', icon: Zap, color: 'bg-yellow-50 border-yellow-100 text-yellow-600' },
    { name: 'React', icon: Atom, color: 'bg-cyan-50 border-cyan-100 text-cyan-600' },
    { name: 'Tailwind', icon: Wind, color: 'bg-teal-50 border-teal-100 text-teal-600' },
    { name: 'Node.js', icon: Server, color: 'bg-green-50 border-green-100 text-green-600' },
    { name: 'MongoDB', icon: Leaf, color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
    { name: 'Vite', icon: Rocket, color: 'bg-purple-50 border-purple-100 text-purple-600' },
    { name: 'Git', icon: GitBranch, color: 'bg-red-50 border-red-100 text-red-600' },
    { name: 'REST API', icon: Plug, color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
    { name: 'Figma', icon: PenTool, color: 'bg-pink-50 border-pink-100 text-pink-600' },
    { name: 'VS Code', icon: Terminal, color: 'bg-blue-50 border-blue-100 text-blue-600' },
  ]

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-amber-400">Portfolio</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 text-xs font-medium tracking-wide">OUR WORK</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Projects We've{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-400">
                Built & Shipped
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              A showcase of our work — from landing pages to full stack applications. Every project is built with clean code, modern design and scalability in mind.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all hover:-translate-y-0.5">
                Start a Project <ArrowRight size={16} />
              </Link>
              <a href="https://github.com/seunultimateconcepts-creator" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                <Github size={16} /> View GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">TECH STACK</p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Skills & Technologies</h2>
              <p className="text-gray-500 mb-8">The tools and technologies I use to build modern, scalable web applications.</p>
              <div className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 text-sm font-semibold">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${skill.color} transition-all duration-1000`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech icons */}
            <div className="grid grid-cols-4 gap-4">
              {techIcons.map((tech) => (
                <div key={tech.name}
                  className={`${tech.color} border rounded-xl p-3 flex flex-col items-center gap-1.5 hover:scale-105 transition-transform`}>
                  <tech.icon size={22} />
                  <span className="text-gray-600 text-[10px] font-semibold text-center">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">PROJECTS</p>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Featured Work</h2>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filters.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeFilter === filter
                    ? 'bg-amber-500 text-[#0a0f2c] shadow-lg shadow-amber-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                {filter}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={project.image} alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-[#0a0f2c] text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <Star size={11} fill="currentColor" /> Featured
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  {/* Hover links */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={project.link}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors">
                      View Live <ArrowRight size={12} />
                    </a>
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-700 transition-colors">
                      <Github size={12} /> GitHub
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-gray-900 font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-lg border border-amber-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add more projects note */}
          <div className="mt-10 flex items-start gap-3 text-center justify-center bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <Lightbulb size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-amber-700 text-sm font-semibold mb-1">Growing Portfolio</p>
              <p className="text-amber-600 text-sm">
                More projects are being added regularly. Each client project we complete gets featured here!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Want us to build something for you?
          </h2>
          <p className="text-gray-400 mb-8">
            Let's discuss your project and add it to our portfolio!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Start a Project <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/2348038786037" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Portfolio
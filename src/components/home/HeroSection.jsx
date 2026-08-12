/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // ✅ Update slide images, tags and text here anytime
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80",
      tag: "Web Development",
      title: "Modern websites built to grow your business",
      desc: "Fast, scalable and beautiful web applications",
    },
    {
      image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&q=80",
      tag: "Crypto Services",
      title: "Buy, sell and trade crypto at the best rates",
      desc: "P2P trading, mentorship and market insights",
    },
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      tag: "Shopping Assistance",
      title: "Order from anywhere, delivered to your door",
      desc: "Jumia, Amazon and international stores",
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      tag: "Web Development",
      title: "Clean code that scales with your business",
      desc: "Built with the latest technologies and best practices",
    },
    {
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
      tag: "Crypto Services",
      title: "Understand the crypto market like a pro",
      desc: "Learn trading strategies with our mentorship program",
    },
    {
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      tag: "Secure Transactions",
      title: "Your safety is our number one priority",
      desc: "All transactions are secure and fully protected",
    },
    {
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      tag: "Full Stack Development",
      title: "From idea to fully working product",
      desc: "Frontend, backend and everything in between",
    },
    {
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
      tag: "P2P Trading",
      title: "Best P2P rates in Nigeria guaranteed",
      desc: "Fast, reliable and trusted crypto exchanges",
    },
    {
      image: "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?w=800&q=80",
      tag: "Shopping Assistance",
      title: "Shop globally without leaving Nigeria",
      desc: "We handle orders from any store worldwide",
    },
    {
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
      tag: "Digital Solutions",
      title: "One platform for all your digital needs",
      desc: "Web · Crypto · Shopping all in one place",
    },
  ]

  // ✅ Auto slides every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // ✅ Hero text — update here anytime
  const headline = "All Your Digital Needs,"
  const subHeadline = "One Trusted Platform"
  const description = "We build modern websites, provide secure crypto services, and help you shop globally with ease."

  return (
    <section className="relative min-h-auto bg-[#0a0f2c] flex items-center overflow-hidden pt-16">

      {/* Background — a single intentional amber glow behind the headline,
          not scattered blue blobs. Dot grid stays as quiet texture. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-amber-500/[0.07] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Side */}
        <div className="space-y-7">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-300 text-xs font-semibold tracking-wide">
              WELCOME TO ULTIMATE TECH LAB
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.08] tracking-tight">
            {headline}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              {subHeadline}
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="group flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95"
            >
              Get Started
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.054 23.447a.5.5 0 0 0 .609.61l5.704-1.49A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.009-1.374l-.36-.213-3.726.973.997-3.634-.234-.374A9.818 9.818 0 1 1 12 21.818z"/>
              </svg>
              Sign Up to Chat
            </Link>
          </div>

          {/* Trust Line */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {["#F5A623", "#60A5FA", "#34D399"].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0f2c]"
                  style={{ backgroundColor: color, opacity: 0.9 }}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Trusted by{" "}
              <span className="text-white font-semibold">500+ clients</span>{" "}
              in Nigeria and beyond
            </p>
          </div>

        </div>

        {/* Right Side — Image Slider */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">

            {/* Glow */}
            <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-2xl scale-110" />

            {/* Slider */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{ height: '380px' }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: index === currentSlide ? 1 : 0 }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2c]/90 via-[#0a0f2c]/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block bg-amber-500/90 text-[#0a0f2c] text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {slide.tag}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Dot indicators */}
              <div className="absolute top-4 right-4 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-6 h-2 bg-amber-400'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, BedDouble, Store, Scissors } from 'lucide-react'

/**
 * UComeBannerCarousel
 *
 * The sliding promo banner at the top of the U-Come page. Auto-advances,
 * pauses on hover/touch, swipeable on phones, with arrows and dots.
 *
 * TO CHANGE THE ADS: edit DEFAULT_SLIDES below.
 *   - tone: 'navy' | 'amber' (the two UTL brand palettes)
 *   - to:   a route like '/shop/ultimate', or '#vendors' to scroll the page
 *   - image (optional): paste a real photo URL (e.g. a Cloudinary link) and
 *     it becomes the slide background under a navy overlay. Use tone 'navy'
 *     with images so the white text stays readable.
 *
 * The built-in slides are brand-designed graphics rather than stock
 * photos, so there's nothing to license or hotlink. Swap in real photos
 * whenever you have them.
 */
export const DEFAULT_SLIDES = [
  {
    id: 'concepts',
    tone: 'navy',
    Icon: ShoppingBag,
    tag: 'ULTIMATE CONCEPTS',
    title: 'Shop Jumia, Amazon & AliExpress without the stress',
    subtitle: 'Tell us what you want. We source it, confirm the price, and get it to you.',
    cta: 'Start a request',
    to: '/shop/ultimate',
  },
  {
    id: 'stays',
    tone: 'amber',
    Icon: BedDouble,
    tag: 'STAYS & BOOKINGS',
    title: 'Book hotels, halls and short-lets in minutes',
    subtitle: 'Pick your dates, see what is already taken, and pay the host directly.',
    cta: 'Browse vendors',
    to: '#vendors',
  },
  {
    id: 'sell',
    tone: 'navy',
    Icon: Store,
    tag: 'SELL ON U-COME',
    title: 'Open your shop and get your own link',
    subtitle: 'Sell products, take bookings or appointments. Verified in days, live automatically.',
    cta: 'Become a vendor',
    to: '/become-seller',
  },
  {
    id: 'local',
    tone: 'amber',
    Icon: Scissors,
    tag: 'LOCAL SERVICES',
    title: 'Salons, barbers, tailors and artisans near you',
    subtitle: 'Book an appointment or request a callout from trusted local pros.',
    cta: 'Find a service',
    to: '#vendors',
  },
]

const TONES = {
  navy: {
    bg: 'bg-gradient-to-br from-[#0a0f2c] via-[#111a4a] to-[#1e2a78]',
    title: 'text-white',
    sub: 'text-gray-300',
    tag: 'text-amber-400',
    cta: 'bg-amber-500 hover:bg-amber-400 text-[#0a0f2c]',
    art: 'text-amber-400',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300',
    title: 'text-[#0a0f2c]',
    sub: 'text-[#0a0f2c]/75',
    tag: 'text-[#0a0f2c]/70',
    cta: 'bg-[#0a0f2c] hover:bg-[#161d4a] text-white',
    art: 'text-[#0a0f2c]',
  },
}

function SlideCTA({ slide, tone, focusable }) {
  const cls = `inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors ${tone.cta}`
  const tabIndex = focusable ? 0 : -1
  const inner = (
    <>
      {slide.cta} <ArrowRight size={16} />
    </>
  )
  if (slide.to.startsWith('#')) {
    return <a href={slide.to} tabIndex={tabIndex} className={cls}>{inner}</a>
  }
  return <Link to={slide.to} tabIndex={tabIndex} className={cls}>{inner}</Link>
}

export default function UComeBannerCarousel({ slides = DEFAULT_SLIDES, interval = 5500 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const count = slides.length

  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2) return undefined
    // Respect people who've asked their device for less motion.
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), interval)
    return () => clearInterval(timer)
  }, [paused, count, interval])

  const onTouchStart = (e) => {
    setPaused(true)
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current != null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1))
    }
    touchStartX.current = null
    setPaused(false)
  }

  return (
    <section className="bg-gray-50 pt-8" aria-roledescription="carousel" aria-label="Featured on U-Come">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl shadow-lg group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => {
              const tone = TONES[slide.tone] || TONES.navy
              const Icon = slide.Icon
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={i !== index}
                  className={`relative min-w-full h-64 sm:h-72 lg:h-80 overflow-hidden ${tone.bg}`}
                >
                  {slide.image && (
                    <>
                      <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f2c]/90 via-[#0a0f2c]/60 to-transparent" />
                    </>
                  )}

                  <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5" />
                  <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-amber-400/10" />

                  {Icon && !slide.image && (
                    <div className="absolute right-6 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-44 h-44 lg:w-56 lg:h-56 rounded-full bg-white/10">
                      <Icon size={88} strokeWidth={1.5} className={tone.art} />
                    </div>
                  )}

                  <div className="relative h-full flex items-center px-8 sm:px-12 lg:px-16">
                    <div className="max-w-xl">
                      <p className={`text-[11px] sm:text-xs font-bold tracking-widest mb-3 ${tone.tag}`}>{slide.tag}</p>
                      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-3 ${slide.image ? 'text-white' : tone.title}`}>
                        {slide.title}
                      </h2>
                      <p className={`text-sm sm:text-base mb-6 max-w-md ${slide.image ? 'text-gray-200' : tone.sub}`}>
                        {slide.subtitle}
                      </p>
                      <SlideCTA slide={slide} tone={tone} focusable={i === index} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(index - 1)}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0a0f2c] items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(index + 1)}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#0a0f2c] items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? 'w-6 bg-amber-500' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

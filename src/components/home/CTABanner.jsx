import { Link } from 'react-router-dom'

function CTABanner() {
  const headline = "Ready to get started?"
  const subtext = "Create your free account and unlock all features."

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a0f2c] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-600/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{headline}</h2>
            <p className="text-gray-400 text-lg mb-8">{subtext}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95">
                Create Free Account →
              </Link>
              <Link to="/login"
                className="px-8 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
                Sign In
              </Link>
              <button
                onClick={() => document.querySelector('[title="Chat with UTL AI"]')?.click()}
                className="flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Chat with UTL AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTABanner
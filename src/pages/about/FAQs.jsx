import { useState } from 'react'
import { Link } from 'react-router-dom'

function FAQs() {
  const [openFaq, setOpenFaq] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Web Development', 'Crypto', 'Shopping', 'General']

  const faqs = [
    // Web Development
    {
      category: 'Web Development',
      question: 'How much does a website cost?',
      answer: 'Website costs vary depending on complexity. A simple landing page starts from ₦50,000, a business website from ₦150,000 and a full stack web application from ₦500,000. Contact us for a free custom quote!',
    },
    {
      category: 'Web Development',
      question: 'How long does it take to build a website?',
      answer: 'A simple landing page takes 3-5 days, a business website 1-2 weeks and a complex web application 3-6 weeks depending on features. We always give you a clear timeline before starting.',
    },
    {
      category: 'Web Development',
      question: 'What technologies do you use?',
      answer: 'We use React, Vite, Tailwind CSS for frontend and Node.js, Express, MongoDB for backend. All our websites are fast, responsive and built with modern best practices.',
    },
    {
      category: 'Web Development',
      question: 'Do you offer website maintenance?',
      answer: 'Yes! We offer ongoing maintenance, updates and support after delivery. Contact us to discuss a maintenance plan that suits your needs.',
    },
    // Crypto
    {
      category: 'Crypto',
      question: 'What cryptocurrencies do you trade?',
      answer: 'We trade Bitcoin (BTC), Ethereum (ETH), USDT, BNB, Solana (SOL), Litecoin (LTC) and many more. Contact us on WhatsApp for current available coins and rates.',
    },
    {
      category: 'Crypto',
      question: 'How do I start crypto trading with UTL?',
      answer: 'Simply contact us on WhatsApp with the amount you want to trade and which coin. We\'ll give you our best rate and guide you through the process step by step.',
    },
    {
      category: 'Crypto',
      question: 'Is crypto trading safe with UTL?',
      answer: 'Yes! We have traded with 500+ clients with zero complaints. We are transparent about rates, fast with settlements and always professional. Your safety is our priority.',
    },
    {
      category: 'Crypto',
      question: 'Do you offer crypto mentorship?',
      answer: 'Absolutely! Our mentorship program covers chart reading, trading strategies, risk management and market analysis. Perfect for complete beginners. Contact us to enroll.',
    },
    // Shopping
    {
      category: 'Shopping',
      question: 'Which stores can you order from?',
      answer: 'We shop from Jumia, Amazon, AliExpress, Konga, Shein, eBay, Temu and virtually any online store worldwide. Just tell us where you want us to shop!',
    },
    {
      category: 'Shopping',
      question: 'How long does delivery take?',
      answer: 'Jumia orders take 2-5 days. International orders (Amazon, AliExpress) take 7-21 days depending on the item and shipping option. We always give you an estimate upfront.',
    },
    {
      category: 'Shopping',
      question: 'How do I pay for my order?',
      answer: 'We accept bank transfers and other trusted payment methods. You pay after we confirm the item is available and give you the total cost including delivery.',
    },
    {
      category: 'Shopping',
      question: 'Do you deliver outside Lagos?',
      answer: 'Yes! We deliver to all 36 states in Nigeria. Delivery fees vary by location. Contact us with your delivery address for an accurate delivery quote.',
    },
    // General
    {
      category: 'General',
      question: 'What are your working hours?',
      answer: 'We are available Monday to Saturday, 9AM to 8PM Nigerian time. For urgent matters you can reach us on WhatsApp and we\'ll respond as soon as possible.',
    },
    {
      category: 'General',
      question: 'How do I contact Ultimate Tech Lab?',
      answer: 'WhatsApp is the fastest way — +234 803 878 6037. You can also email us at seunultimateconcepts@gmail.com or fill the contact form on our website.',
    },
    {
      category: 'General',
      question: 'Where is Ultimate Tech Lab located?',
      answer: 'We are based in Lagos, Nigeria but we serve clients nationwide and internationally. All our services are available online so location is not a barrier.',
    },
  ]

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/about" className="hover:text-white">About</Link>
            <span>›</span>
            <span className="text-blue-400">FAQs</span>
          </div>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-xs font-medium tracking-wide">FAQs</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Questions
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Everything you need to know about our services. Can't find your answer? Chat us on WhatsApp!
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-start gap-3 flex-1 pr-4">
                    <span className="text-blue-600 font-black text-sm mt-0.5 flex-shrink-0">Q.</span>
                    <span className="text-gray-900 font-semibold text-sm leading-relaxed">{faq.question}</span>
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-6 border-t border-gray-50">
                    <div className="flex gap-3 pt-4">
                      <span className="text-green-600 font-black text-sm flex-shrink-0">A.</span>
                      <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 bg-[#0a0f2c] rounded-2xl p-8 text-center">
            <h3 className="text-white font-black text-xl mb-2">Still have questions? 🤔</h3>
            <p className="text-gray-400 text-sm mb-6">
              Can't find what you're looking for? Chat with us directly on WhatsApp!
            </p>
            <a href="https://wa.me/2348038786037?text=Hello! I have a question about UTL services."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors text-sm">
              Chat on WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Back nav */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-4">
          <Link to="/about/vision"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
            ← Our Vision
          </Link>
          <Link to="/about"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
            Back to About
          </Link>
        </div>
      </section>

    </div>
  )
}

export default FAQs
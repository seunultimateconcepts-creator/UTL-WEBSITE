import { useState } from 'react'
import { Link } from 'react-router-dom'

function ShoppingAssistance() {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    item: '',
    store: '',
    budget: '',
    address: '',
    notes: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = `
🛒 *New Shopping Order!*

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Item:* ${formData.item}
*Store:* ${formData.store || 'Any'}
*Budget:* ${formData.budget}
*Delivery Address:* ${formData.address}
*Notes:* ${formData.notes || 'None'}
    `.trim()
    window.open(`https://wa.me/2348038786037?text=${encodeURIComponent(message)}`, '_blank')
  }

  // ✅ How it works steps
  const steps = [
    { icon: '💬', title: 'Tell Us What You Want', desc: 'Fill the order form or chat us on WhatsApp with the item name, store and your budget.' },
    { icon: '💰', title: 'Get a Quote', desc: 'We send you the total cost including item price, delivery fee and our service charge.' },
    { icon: '💳', title: 'Make Payment', desc: 'Pay securely via bank transfer or any trusted payment method.' },
    { icon: '🚚', title: 'We Order & Deliver', desc: 'We place the order and deliver it to your doorstep anywhere in Nigeria.' },
  ]

  // ✅ Stores we shop from
  const stores = [
    { name: 'Jumia', flag: '🟠', desc: 'Nigeria\'s largest online store' },
    { name: 'Amazon', flag: '📦', desc: 'Global shipping available' },
    { name: 'AliExpress', flag: '🔴', desc: 'Affordable Chinese products' },
    { name: 'Konga', flag: '🟣', desc: 'Nigerian e-commerce' },
    { name: 'Shein', flag: '🩷', desc: 'Fashion and clothing' },
    { name: 'eBay', flag: '🔵', desc: 'New and used products' },
    { name: 'Temu', flag: '🟢', desc: 'Budget friendly products' },
    { name: 'Any Store', flag: '🌍', desc: 'We shop from anywhere!' },
  ]

  // ✅ What we can order
  const categories = [
    { icon: '📱', name: 'Phones & Tablets' },
    { icon: '💻', name: 'Laptops & PCs' },
    { icon: '👗', name: 'Fashion & Clothing' },
    { icon: '🎮', name: 'Gaming & Consoles' },
    { icon: '🏠', name: 'Home & Kitchen' },
    { icon: '💄', name: 'Beauty & Skincare' },
    { icon: '📷', name: 'Cameras & Gadgets' },
    { icon: '🎵', name: 'Audio & Music' },
    { icon: '⌚', name: 'Watches & Jewelry' },
    { icon: '📚', name: 'Books & Education' },
    { icon: '🏋️', name: 'Sports & Fitness' },
    { icon: '🧸', name: 'Toys & Baby Items' },
  ]

  // ✅ Why choose us
  const benefits = [
    { icon: '🌍', title: 'Shop Globally', desc: 'Order from any store in the world — we handle international shipping.' },
    { icon: '💰', title: 'Best Prices', desc: 'We find the best deals and prices for your items.' },
    { icon: '🔒', title: 'Secure Payment', desc: 'Your money is safe — we only pay stores after confirming your order.' },
    { icon: '📍', title: 'Nationwide Delivery', desc: 'We deliver to any location in Nigeria.' },
    { icon: '📦', title: 'Package Tracking', desc: 'We keep you updated every step of the delivery process.' },
    { icon: '⚡', title: 'Fast Service', desc: 'Quick order processing and reliable delivery times.' },
  ]

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>›</span>
            <span className="text-orange-400">Shopping Assistance</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-orange-300 text-xs font-medium tracking-wide">SHOPPING ASSISTANCE</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Shop From Anywhere,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  Delivered to You
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                We order from Jumia, Amazon, AliExpress and any online store worldwide and deliver straight to your doorstep anywhere in Nigeria!
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#order"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                  Place an Order →
                </a>
               <Link to="/signup" className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
  Place an Order →
</Link>
              </div>
            </div>

            {/* Right — Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '8+', label: 'Stores We Shop From', icon: '🏪' },
                { value: '100%', label: 'Delivery Success Rate', icon: '✅' },
                { value: '36', label: 'States in Nigeria', icon: '📍' },
                { value: '24hrs', label: 'Order Response Time', icon: '⚡' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                  <span className="text-3xl block mb-2">{stat.icon}</span>
                  <p className="text-white text-2xl font-black mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stores We Shop From */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">STORES</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">We Shop From These Stores</h2>
            <p className="text-gray-500">And many more — just tell us where you want us to shop!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stores.map((store) => (
              <div key={store.name}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="text-3xl block mb-2">{store.flag}</span>
                <p className="text-gray-900 font-bold text-sm mb-1">{store.name}</p>
                <p className="text-gray-400 text-xs">{store.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Can Order */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">CATEGORIES</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">What Can We Order For You?</h2>
            <p className="text-gray-500">Virtually anything! Here are the most popular categories.</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div key={cat.name}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="text-gray-700 text-xs font-semibold group-hover:text-orange-600 transition-colors">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Simple 4-Step Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-orange-200" />
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-orange-50 border-2 border-orange-100 flex items-center justify-center text-3xl mb-5 hover:border-orange-400 transition-all">
                  {step.icon}
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                {index < steps.length - 1 && (
                  <div className="md:hidden text-orange-300 text-2xl mt-4">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">WHY CHOOSE US</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Why Use UTL Shopping?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-orange-100 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">PLACE AN ORDER</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">What Would You Like to Order?</h2>
            <p className="text-gray-500">Fill the form and we'll get back to you with a quote within 1 hour!</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name / Description *</label>
                <input type="text" name="item" required value={formData.item} onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro Max 256GB Black"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Store</label>
                  <select name="store" value={formData.store} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors">
                    <option value="">Any store</option>
                    {stores.filter(s => s.name !== 'Any Store').map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Budget *</label>
                  <input type="text" name="budget" required value={formData.budget} onChange={handleChange}
                    placeholder="e.g. ₦150,000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange}
                  placeholder="Full delivery address including city and state"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes</label>
                <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange}
                  placeholder="Any specific color, size, model or other details..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none" />
              </div>

              <button type="submit"
                className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-95">
                Send Order via WhatsApp 📱
              </button>

              <p className="text-gray-400 text-xs text-center">
                Clicking send opens WhatsApp with your order details. We respond within 1 hour!
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Can't find what you need?</h2>
          <p className="text-gray-400 mb-8">Just tell us what you want and we'll find it for you!</p>
          <a href="https://wa.me/2348038786037?text=Hello! I need help finding a product."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
            Chat on WhatsApp →
          </a>
        </div>
      </section>

    </div>
  )
}

export default ShoppingAssistance
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthGuard from '../hooks/useAuthGuard'

function Shop() {
const { requireAuth } = useAuthGuard()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStore, setActiveStore] = useState('All')

  // ✅ Categories — add more here anytime
  const categories = ['All', 'Phones', 'Laptops', 'Fashion', 'Electronics', 'Home & Kitchen', 'Gaming', 'Beauty']

  // ✅ Store filters
  const stores = ['All', 'Jumia', 'Amazon', 'AliExpress', 'Konga']

  // ✅ Products — add/remove products here
  // To add a new product just add a new object
  const products = [
    {
      id: 1,
      name: 'Tecno Spark 20 Pro 8GB RAM 256GB',
      price: '₦189,000',
      oldPrice: '₦220,000',
      category: 'Phones',
      store: 'Jumia',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
      link: 'https://www.jumia.com.ng/phones/',
    },
    {
      id: 2,
      name: 'Samsung Galaxy A55 5G 128GB',
      price: '₦350,000',
      oldPrice: '₦400,000',
      category: 'Phones',
      store: 'Jumia',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
      link: 'https://www.jumia.com.ng/phones/',
    },
    {
      id: 3,
      name: 'HP Pavilion Laptop 15" Intel i5',
      price: '₦580,000',
      oldPrice: '₦650,000',
      category: 'Laptops',
      store: 'Amazon',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
      link: 'https://www.amazon.com/laptops',
    },
    {
      id: 4,
      name: 'Lenovo IdeaPad 3 Intel i3 8GB',
      price: '₦380,000',
      oldPrice: null,
      category: 'Laptops',
      store: 'Jumia',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80',
      link: 'https://www.jumia.com.ng/laptops/',
    },
    {
      id: 5,
      name: 'Nike Air Max 270 Sneakers',
      price: '₦45,000',
      oldPrice: '₦60,000',
      category: 'Fashion',
      store: 'Jumia',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      link: 'https://www.jumia.com.ng/fashion/',
    },
    {
      id: 6,
      name: 'Sony WH-1000XM5 Headphones',
      price: '₦220,000',
      oldPrice: null,
      category: 'Electronics',
      store: 'AliExpress',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      link: 'https://www.aliexpress.com',
    },
    {
      id: 7,
      name: 'Canon EOS M50 Camera Kit',
      price: '₦380,000',
      oldPrice: '₦420,000',
      category: 'Electronics',
      store: 'Amazon',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
      link: 'https://www.amazon.com/cameras',
    },
    {
      id: 8,
      name: 'PS5 Console + Extra Controller',
      price: '₦650,000',
      oldPrice: '₦720,000',
      category: 'Gaming',
      store: 'Jumia',
      image: 'https://images.unsplash.com/photo-1607853202273-232359e85a5e?w=400&q=80',
      link: 'https://www.jumia.com.ng/gaming/',
    },
    {
      id: 9,
      name: 'Dyson V11 Cordless Vacuum',
      price: '₦280,000',
      oldPrice: null,
      category: 'Home & Kitchen',
      store: 'Amazon',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      link: 'https://www.amazon.com',
    },
    {
      id: 10,
      name: 'Samsung 55" 4K Smart TV',
      price: '₦520,000',
      oldPrice: '₦600,000',
      category: 'Electronics',
      store: 'Jumia',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
      link: 'https://www.jumia.com.ng/tvs/',
    },
    {
      id: 11,
      name: 'Apple AirPods Pro 2nd Gen',
      price: '₦195,000',
      oldPrice: '₦230,000',
      category: 'Electronics',
      store: 'Amazon',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
      link: 'https://www.amazon.com',
    },
    {
      id: 12,
      name: 'Xiaomi Robot Vacuum Cleaner',
      price: '₦145,000',
      oldPrice: null,
      category: 'Home & Kitchen',
      store: 'AliExpress',
      image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&q=80',
      link: 'https://www.aliexpress.com',
    },
    {
        id: 13,
        name:'SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jars',
        price: '₦21,699',
        oldPrice: null,
        category: 'Home & Kitchen',
        store: 'Jumia',
        image: 'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/16/9080814/1.jpg?9815',
        link: 'https://www.jumia.com.ng/silver-crest-2l-industrial-8500w-food-crusher-blender-with-2-jar-418080961.html?utm_source=whatsapp&utm_medium=social&utm_campaign=pdpshare',
    }
  ]

  // ✅ Filter products based on search, category and store
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesStore = activeStore === 'All' || product.store === activeStore
    return matchesSearch && matchesCategory && matchesStore
  })

  // ✅ Generate WhatsApp order message
  const handleOrder = (product) => {
  const user = JSON.parse(localStorage.getItem('utl_current_user'))
  const message = `
🛒 *New Order from UTL Shop!*

*Customer:* ${user.firstName} ${user.lastName}
*Email:* ${user.email}
*Phone:* ${user.phone}

*Product:* ${product.name}
*Price:* ${product.price}
*Store:* ${product.store}

Please process this order. Thank you!`.trim()

  // Open WhatsApp
  window.open(`https://wa.me/2348038786037?text=${encodeURIComponent(message)}`, '_blank')
}

  // ✅ Store badge colors
  const storeColors = {
    Jumia: 'bg-orange-100 text-orange-700',
    Amazon: 'bg-yellow-100 text-yellow-700',
    AliExpress: 'bg-red-100 text-red-700',
    Konga: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-orange-300 text-xs font-medium tracking-wide">🛒 UTL SHOP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Order Anything,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Delivered to You
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Browse our featured products and order via WhatsApp. We shop from Jumia, Amazon, AliExpress and more — delivered anywhere in Nigeria!
          </p>
                    

          {/* Search Bar */}
          <div className="flex max-w-xl mx-auto gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for phones, laptops, fashion..."
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors"
            />
            <button className="px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
              Search
            </button>
            <button
  onClick={() => {
    const user = localStorage.getItem('utl_current_user')
    if (!user) {
      window.location.href = '/signup?role=seller'
    } else {
      const parsed = JSON.parse(user)
      if (parsed.accountType === 'seller') {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/signup?role=seller'
      }
    }
  }}
  className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
>
  🏪 Become a Seller
</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-orange-50 border-b border-orange-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🔍', title: 'Browse', desc: 'Find what you want' },
              { icon: '💬', title: 'Order', desc: 'Send via WhatsApp' },
              { icon: '💳', title: 'Pay', desc: 'Secure payment' },
              { icon: '🚚', title: 'Delivered', desc: 'To your doorstep' },
            ].map((step, index) => (
              <div key={step.title} className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{step.title}</p>
                  <p className="text-gray-500 text-xs">{step.desc}</p>
                </div>
                {index < 3 && <span className="hidden md:block text-gray-300 ml-auto">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">

                {/* Store Filter */}
                <h4 className="text-gray-900 font-bold text-sm mb-4 uppercase tracking-wider">
                  Filter by Store
                </h4>
                <div className="space-y-2 mb-6">
                  {stores.map((store) => (
                    <button
                      key={store}
                      onClick={() => setActiveStore(store)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeStore === store
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {store === 'All' ? '🏪 All Stores' :
                       store === 'Jumia' ? '🟠 Jumia' :
                       store === 'Amazon' ? '📦 Amazon' :
                       store === 'AliExpress' ? '🔴 AliExpress' : '🟣 Konga'}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <hr className="border-gray-100 mb-6" />

                {/* Category Filter */}
                <h4 className="text-gray-900 font-bold text-sm mb-4 uppercase tracking-wider">
                  Categories
                </h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <hr className="border-gray-100 my-6" />

                {/* Need help box */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-green-800 text-xs font-bold mb-1">Can't find it? 🔍</p>
                  <p className="text-green-700 text-xs mb-3">
                    Tell us what you need and we'll find it for you!
                  </p>
                  
                  <a
                    href="https://wa.me/2348038786037?text=Hello! I need help finding a product."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-semibold rounded-lg text-center transition-colors"
                  >
                    Ask on WhatsApp
                  </a>
                </div>

              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">

              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500 text-sm">
                  Showing <span className="text-gray-900 font-semibold">{filteredProducts.length}</span> products
                  {activeCategory !== 'All' && ` in ${activeCategory}`}
                  {activeStore !== 'All' && ` from ${activeStore}`}
                </p>
                {(activeCategory !== 'All' || activeStore !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveCategory('All')
                      setActiveStore('All')
                      setSearchQuery('')
                    }}
                    className="text-blue-600 text-xs font-semibold hover:text-blue-700"
                  >
                    Clear filters ✕
                  </button>
                )}
              </div>

              {/* No results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-gray-900 font-bold mb-2">No products found</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Try a different search or contact us and we'll find it for you!
                  </p>
                  <a
                    href={`https://wa.me/2348038786037?text=Hello! I'm looking for: ${searchQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl text-sm"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              )}

              {/* Products */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Product Image */}
                <div className="h-44 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:48px">🛒</div>'
                    }}
                />
                </div>

                    {/* Product Info */}
                    <div className="p-5">
                      {/* Store badge */}
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 ${storeColors[product.store]}`}>
                        {product.store}
                      </span>

                      {/* Name */}
                      <h3 className="text-gray-900 font-bold text-sm leading-snug mb-3 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-blue-600 font-black text-lg">{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-gray-400 text-xs line-through">{product.oldPrice}</span>
                        )}
                      </div>

                      {/* Buttons */}
                      <button
  onClick={() => requireAuth(() => handleOrder(product))}
  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
>
  Place Order
</button>

                        {/* View on store */}
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-colors"
                          title={`View on ${product.store}`}
                        >
                          🔗
                        </a>
                      </div>
                    </div>

                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-400 mb-8">
            Tell us what you need and we'll source it from any store worldwide and deliver it to you anywhere in Nigeria!
          </p>
          <a
            href="https://wa.me/2348038786037?text=Hello! I need help finding a product."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.054 23.447a.5.5 0 0 0 .609.61l5.704-1.49A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.009-1.374l-.36-.213-3.726.973.997-3.634-.234-.374A9.818 9.818 0 1 1 12 21.818z"/>
            </svg>
            Request a Product on WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}

export default Shop;
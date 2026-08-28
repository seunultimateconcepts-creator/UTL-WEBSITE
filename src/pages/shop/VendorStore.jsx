import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Store, ShoppingBag, ArrowLeft, PackageX } from 'lucide-react'
import ShareLink from '../../components/ShareLink'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function VendorStore() {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [vendorName, setVendorName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/products?vendorId=${vendorId}`)
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
          // Vendor name comes along with the first product's populated
          // vendor field if your API returns it — falling back to a
          // generic label if not.
          if (data.products[0]?.vendorId?.firstName) {
            setVendorName(`${data.products[0].vendorId.firstName} ${data.products[0].vendorId.lastName}`)
          }
        }
      } catch (err) {
        console.error('Failed to load vendor products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [vendorId])

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to U-Come
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Store size={28} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{vendorName || 'Vendor Store'}</h1>
                <p className="text-gray-400 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
              </div>
            </div>
            <ShareLink
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={`${vendorName || 'Vendor Store'} on Ultimate Tech Lab`}
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-gray-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <PackageX size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-900 font-bold mb-2">No products listed yet</p>
              <p className="text-gray-500 text-sm">This vendor hasn't added any products.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/shop/vendor/${vendorId}/product/${product._id}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 mb-3">
                    {product.category}
                  </span>
                  <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-amber-600 font-black text-lg">
                    {product.currency} {product.price.toLocaleString()}
                  </p>
                  {product.stock === 0 && (
                    <p className="text-red-500 text-xs font-semibold mt-1">Out of stock</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default VendorStore
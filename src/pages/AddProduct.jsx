import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, X, Package, PartyPopper, Trash2 } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const CATEGORIES = [
  'Phones & Tablets', 'Laptops & Computers', 'Fashion & Clothing',
  'Electronics', 'Home & Kitchen', 'Gaming', 'Beauty & Personal Care',
  'Food & Groceries', 'Sports & Fitness', 'Books & Stationery', 'Other',
]

function AddProduct() {
  const navigate = useNavigate()
  const { productId } = useParams() // ✅ present only on /dashboard/edit-product/:productId
  const isEditMode = !!productId

  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(isEditMode)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    deliveryPolicy: '',
    returnsPolicy: '',
  })
  const [images, setImages] = useState([''])
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }])

  // ✅ Prefill everything when editing an existing product
  useEffect(() => {
    if (!isEditMode) return

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/${productId}`)
        const data = await res.json()
        if (!data.success) {
          setError('Could not load this product')
          return
        }
        const p = data.product
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price?.toString() || '',
          category: p.category || '',
          stock: p.stock?.toString() || '',
          deliveryPolicy: p.policies?.delivery || '',
          returnsPolicy: p.policies?.returns || '',
        })
        setImages(p.images?.length ? p.images : [''])
        setFaqs(p.faqs?.length ? p.faqs : [{ question: '', answer: '' }])
      } catch (err) {
        console.error('Failed to load product:', err)
        setError('Network error loading this product')
      } finally {
        setLoadingProduct(false)
      }
    }
    fetchProduct()
  }, [productId, isEditMode])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const updateImage = (index, value) => {
    setImages(prev => prev.map((img, i) => (i === index ? value : img)))
  }
  const addImageField = () => setImages(prev => [...prev, ''])
  const removeImageField = (index) => setImages(prev => prev.filter((_, i) => i !== index))

  const updateFaq = (index, field, value) => {
    setFaqs(prev => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)))
  }
  const addFaqField = () => setFaqs(prev => [...prev, { question: '', answer: '' }])
  const removeFaqField = (index) => setFaqs(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('utl_token')
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock) || 0,
        images: images.filter(img => img.trim()),
        faqs: faqs.filter(f => f.question.trim() && f.answer.trim()),
        policies: {
          delivery: formData.deliveryPolicy,
          returns: formData.returnsPolicy,
        },
      }

      const url = isEditMode ? `${BASE_URL}/products/my-products/${productId}` : `${BASE_URL}/products`
      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Something went wrong')
        return
      }

      setSuccess(data.product)
    } catch (err) {
      setError('Network error — please try again')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${formData.name}"? This can't be undone.`)) return
    setDeleting(true)
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/products/my-products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to delete product')
        return
      }
      navigate('/dashboard')
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Network error — please try again')
    } finally {
      setDeleting(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <PartyPopper size={48} className="mx-auto mb-4 text-orange-500" />
          <h2 className="text-xl font-black text-gray-900 mb-2">{isEditMode ? 'Product Updated!' : 'Product Listed!'}</h2>
          <p className="text-gray-500 text-sm mb-6">
            "{success.name}" {isEditMode ? 'has been updated.' : 'is now live on your store.'}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
            {!isEditMode && (
              <button
                onClick={() => { setSuccess(null); setFormData({ name: '', description: '', price: '', category: '', stock: '', deliveryPolicy: '', returnsPolicy: '' }); setImages(['']); setFaqs([{ question: '', answer: '' }]) }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                Add Another Product
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">{isEditMode ? 'Edit Product' : 'List a New Product'}</h1>
              <p className="text-gray-500 text-sm">
                {isEditMode ? 'Update your listing below.' : "Fill in the details below — the more you add, the fewer questions you'll have to answer yourself."}
              </p>
            </div>
          </div>
          {isEditMode && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
            >
              <Trash2 size={13} /> {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-gray-900 font-bold text-sm">Basic Information</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="e.g. Samsung Galaxy A55 5G 128GB"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange}
                placeholder="Describe the product — condition, specs, what's included..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Price (₦) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange}
                  placeholder="150000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                  placeholder="10"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors">
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h3 className="text-gray-900 font-bold text-sm">Product Images</h3>
            <p className="text-gray-400 text-xs -mt-2">Paste image URLs for now — direct upload is coming later.</p>
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={img} onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
                {images.length > 1 && (
                  <button type="button" onClick={() => removeImageField(i)}
                    className="w-10 h-10 flex-shrink-0 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addImageField}
              className="flex items-center gap-1.5 text-orange-600 text-xs font-semibold hover:text-orange-700">
              <Plus size={14} /> Add another image
            </button>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h3 className="text-gray-900 font-bold text-sm">FAQs</h3>
            <p className="text-gray-400 text-xs -mt-2">
              These ground the AI chat on your product page — the more you fill in, the fewer questions get escalated to you personally.
            </p>
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2 relative">
                {faqs.length > 1 && (
                  <button type="button" onClick={() => removeFaqField(i)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <input type="text" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)}
                  placeholder="Question (e.g. Does this come with a warranty?)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
                <textarea rows={2} value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                  placeholder="Answer"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none" />
              </div>
            ))}
            <button type="button" onClick={addFaqField}
              className="flex items-center gap-1.5 text-orange-600 text-xs font-semibold hover:text-orange-700">
              <Plus size={14} /> Add another FAQ
            </button>
          </div>

          {/* Policies */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-gray-900 font-bold text-sm">Policies (optional)</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Delivery</label>
              <input type="text" name="deliveryPolicy" value={formData.deliveryPolicy} onChange={handleChange}
                placeholder="e.g. 2-5 business days within Lagos"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Returns</label>
              <input type="text" name="returnsPolicy" value={formData.returnsPolicy} onChange={handleChange}
                placeholder="e.g. 7-day return window, item must be unused"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all">
            {loading ? (isEditMode ? 'Saving Changes...' : 'Listing Product...') : (isEditMode ? 'Save Changes' : 'List Product')}
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddProduct
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store, Globe, Wallet, ShieldCheck, MessageCircle, Zap, Gem,
  PartyPopper, Send, Check, ArrowRight, MapPin, ArrowLeft, Camera, UserCircle,
} from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import { compressImageToBase64 } from '../utils/compressImageToBase64'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function BecomeSeller() {
  const navigate = useNavigate()
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // ✅ You must already be a registered UTL user to apply — the backend
  // already enforces this (submitSellerApplication requires a valid
  // login token), but redirecting here means someone finds out BEFORE
  // filling out a two-step form, not after submitting it.
  useEffect(() => {
    const currentUser = localStorage.getItem('utl_current_user')
    if (!currentUser) {
      localStorage.setItem('utl_redirect_after_login', '/become-seller')
      navigate('/login')
      return
    }
    setLoggedInUser(JSON.parse(currentUser))
    setCheckingAuth(false)
  }, [navigate])

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    shopName: '',
    businessCategory: 'Product Seller',
    bio: '',
    shopAddress: '',
    shopPhotoUrl: '',
    cacNumber: '',
    nin: '',
  })
  const [ninPhotoBase64, setNinPhotoBase64] = useState('')
  const [selfiePhotoBase64, setSelfiePhotoBase64] = useState('')
  const [compressingNin, setCompressingNin] = useState(false)
  const [compressingSelfie, setCompressingSelfie] = useState(false)
  const [location, setLocation] = useState(null) // { lat, lng }
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [zones, setZones] = useState([])
  const [statesLGAs, setStatesLGAs] = useState({})
  const [selectedState, setSelectedState] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const benefits = [
    { icon: Globe, title: 'Wide Reach', desc: 'Access thousands of customers visiting Ultimate Tech Lab daily.' },
    { icon: Wallet, title: 'More Sales', desc: 'Our growing traffic means more eyes on your products.' },
    { icon: ShieldCheck, title: 'Trusted Platform', desc: 'Customers trust UTL — that trust extends to your products.' },
    { icon: MessageCircle, title: 'WhatsApp Orders', desc: 'Customers contact you directly — no middleman on orders.' },
    { icon: Zap, title: 'Quick Setup', desc: 'Get listed in less than 24 hours after approval.' },
    { icon: Gem, title: 'Free to Start', desc: 'List up to 10 products completely free.' },
  ]

  const plans = [
    {
      name: 'Free',
      price: '₦0',
      period: 'forever',
      borderColor: 'border-gray-200',
      btnClass: 'bg-gray-800 hover:bg-gray-700 text-white',
      featured: false,
      features: ['Up to 10 products', 'Real-time buyer chat', 'Direct call button', 'UTL support'],
    },
    {
      name: 'Silver',
      price: '₦20,000',
      period: 'year',
      borderColor: 'border-gray-300',
      btnClass: 'bg-gray-600 hover:bg-gray-500 text-white',
      featured: false,
      features: ['Up to 40 products', 'Everything in Free'],
    },
    {
      name: 'Gold',
      price: '₦50,000',
      period: 'year',
      borderColor: 'border-amber-400',
      btnClass: 'bg-amber-500 hover:bg-amber-400 text-[#0a0f2c]',
      featured: true,
      features: ['Up to 100 products', 'Everything in Silver'],
    },
    {
      name: 'Platinum',
      price: '₦100,000',
      period: 'year',
      borderColor: 'border-orange-400',
      btnClass: 'bg-orange-500 hover:bg-orange-400 text-white',
      featured: false,
      features: ['Unlimited products', 'Product videos', 'Everything in Gold'],
    },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    fetch(`${BASE_URL}/orders/delivery-zones`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setZones(data.zones) })
      .catch((err) => console.error('Failed to load states:', err))

    fetch(`${BASE_URL}/orders/nigeria-lgas`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setStatesLGAs(data.statesLGAs) })
      .catch((err) => console.error('Failed to load LGA list:', err))
  }, [])

  const handleStateChange = (e) => {
    setSelectedState(e.target.value)
    setSelectedLGA('')
  }

  const handleLGAChange = (e) => {
    const lga = e.target.value
    setSelectedLGA(lga)
    if (lga) {
      setFormData((prev) => ({
        ...prev,
        shopAddress: prev.shopAddress.startsWith(lga) ? prev.shopAddress : `${lga}, ${prev.shopAddress}`.replace(/^, /, ''),
      }))
    }
  }

  const lgasForState = statesLGAs[selectedState] || []

  // ✅ Compressed and converted entirely client-side — these never
  // touch Cloudinary or any persistent storage. They exist only in
  // component state until submission, at which point they go straight
  // into the one-time admin email and nowhere else.
  const handleNinPhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCompressingNin(true)
    try {
      const base64 = await compressImageToBase64(file)
      setNinPhotoBase64(base64)
    } catch (err) {
      console.error('NIN photo processing failed:', err)
      setSubmitError('Could not process that image — please try a different photo')
    } finally {
      setCompressingNin(false)
    }
  }

  const handleSelfiePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCompressingSelfie(true)
    try {
      const base64 = await compressImageToBase64(file)
      setSelfiePhotoBase64(base64)
    } catch (err) {
      console.error('Selfie processing failed:', err)
      setSubmitError('Could not process that image — please try a different photo')
    } finally {
      setCompressingSelfie(false)
    }
  }

  const handleGetLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location access')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocationError('Could not get your location — please allow location access and try again')
        setLocating(false)
      }
    )
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!formData.shopName.trim() || !formData.bio.trim() || !formData.shopAddress.trim() || !formData.shopPhotoUrl || !selectedState) {
      setSubmitError('Please fill in your shop name, bio, state, shop address, and upload a shop photo')
      return
    }
    setSubmitError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!formData.nin.trim()) {
      setSubmitError('NIN is required for verification')
      return
    }
    if (!ninPhotoBase64) {
      setSubmitError('Please upload a photo of your NIMC slip/card')
      return
    }
    if (!selfiePhotoBase64) {
      setSubmitError('Please upload a selfie for the liveness check')
      return
    }
    if (!location) {
      setSubmitError('Please share your live location')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('utl_token')
      const res = await fetch(`${BASE_URL}/sellers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          shopName: formData.shopName,
          businessCategory: formData.businessCategory,
          bio: formData.bio,
          shopAddress: formData.shopAddress,
          shopPhotoUrl: formData.shopPhotoUrl,
          cacNumber: formData.cacNumber,
          nin: formData.nin,
          ninPhotoBase64,
          selfiePhotoBase64,
          lat: location.lat,
          lng: location.lng,
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setSubmitError(data.message || 'Something went wrong — please try again')
        return
      }
      setSubmitted(true)
    } catch (err) {
      console.error('Application submission failed:', err)
      setSubmitError('Network error — please check your connection and try again')
    } finally {
      setSubmitting(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-[#0a0f2c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <Store size={13} className="text-orange-300" />
            <span className="text-orange-300 text-xs font-medium tracking-wide">
              SELL ON UTL
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Grow Your Business{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              With Us
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join Ultimate Tech Lab marketplace and reach thousands of customers. List your products and start selling today!
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Apply Now — It's Free <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/2348038786037?text=Hello! I want to sell on UTL Shop"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">
              WHY SELL WITH US
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Benefits of Selling on UTL
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Everything you need to grow your business online.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <benefit.icon size={22} className="text-orange-600" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">
              PRICING
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Simple Pricing Plans
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Start free and upgrade as your business grows.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-6 border-2 ${plan.borderColor} relative ${plan.featured ? 'shadow-xl' : 'shadow-sm'}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-[#0a0f2c] text-xs font-bold px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-gray-900 font-black text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  className={`block w-full py-3 font-bold rounded-xl text-center text-sm transition-all hover:-translate-y-0.5 ${plan.btnClass}`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">
              GET STARTED
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Apply to Sell on UTL
            </h2>
            <p className="text-gray-500">
              Fill in the form and we'll get back to you within 3-4 days.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <PartyPopper size={56} className="mx-auto mb-4 text-orange-500" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-500 mb-2">
                  We've received your details and verification is underway.
                </p>
                <p className="text-gray-500 mb-6">
                  We'll email you once your account is approved — usually within 3-4 days.
                </p>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`flex items-center gap-2 ${step === 1 ? 'text-orange-600' : 'text-gray-400'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>1</span>
                    <span className="text-sm font-semibold">Shop Info</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className={`flex items-center gap-2 ${step === 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>2</span>
                    <span className="text-sm font-semibold">Verification</span>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </div>
                )}

                {step === 1 && (
                  <form onSubmit={handleNext} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shop Name *</label>
                        <input
                          type="text"
                          value={formData.shopName}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          placeholder="e.g. Mama Tee Shop"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Type *</label>
                        <select
                          value={formData.businessCategory}
                          onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                        >
                          <option value="Product Seller">Product Seller</option>
                          <option value="Hotel / Accommodation">Hotel / Accommodation</option>
                          <option value="Restaurant / Eatery">Restaurant / Eatery</option>
                          <option value="Property (Rent/Sale)">Property (Rent/Sale)</option>
                          <option value="Printing & Documents">Printing & Documents</option>
                          <option value="Service Provider">Service Provider (car wash, repairs, etc.)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Shop Photo *
                      </label>
                      <p className="text-gray-400 text-xs mb-2">This becomes your storefront's cover image.</p>
                      <ImageUpload
                        value={formData.shopPhotoUrl}
                        onChange={(url) => setFormData({ ...formData, shopPhotoUrl: url })}
                        label="Upload your shop photo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Tell us about your business *
                      </label>
                      <p className="text-gray-400 text-xs mb-2">This becomes your shop's "About Us" page automatically.</p>
                      <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="What do you sell? What makes your shop worth buying from?"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">State *</label>
                        <select
                          value={selectedState} onChange={handleStateChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                        >
                          <option value="">Select state</option>
                          {zones.map((z) => (
                            <option key={z.id} value={z.id}>{z.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">LGA</label>
                        <select
                          value={selectedLGA} onChange={handleLGAChange}
                          disabled={!selectedState}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">{selectedState ? 'Select LGA' : 'Pick a state first'}</option>
                          {lgasForState.map((lga) => (
                            <option key={lga} value={lga}>{lga}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Shop Address *
                      </label>
                      <p className="text-gray-400 text-xs mb-2">This becomes your shop's "Contact Us" page automatically.</p>
                      <input
                        type="text"
                        name="shopAddress"
                        value={formData.shopAddress}
                        onChange={handleChange}
                        placeholder="Street, area, city"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 text-sm"
                    >
                      Continue to Verification <ArrowRight size={16} />
                    </button>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 text-xs leading-relaxed">
                        Your NIN, NIMC photo, and selfie are used only for a one-time manual verification check.
                        <strong> None of this is stored in our database</strong> — everything is sent securely
                        for review and then discarded.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                      <UserCircle size={18} className="text-gray-400 flex-shrink-0" />
                      <p className="text-gray-600 text-sm">
                        Applying as <strong>{loggedInUser?.firstName} {loggedInUser?.lastName}</strong> — from your account.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIN *</label>
                      <input
                        type="text"
                        name="nin"
                        value={formData.nin}
                        onChange={handleChange}
                        placeholder="National Identification Number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo of your NIMC Slip *</label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
                          {compressingNin ? (
                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          ) : ninPhotoBase64 ? (
                            <img src={ninPhotoBase64} alt="NIMC slip" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <>
                              <Camera size={18} className="text-gray-400" />
                              <span className="text-gray-500 text-xs">Upload photo</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={handleNinPhotoChange} className="hidden" />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selfie (Liveness Check) *</label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
                          {compressingSelfie ? (
                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          ) : selfiePhotoBase64 ? (
                            <img src={selfiePhotoBase64} alt="Selfie" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <>
                              <Camera size={18} className="text-gray-400" />
                              <span className="text-gray-500 text-xs">Take/upload selfie</span>
                            </>
                          )}
                          <input type="file" accept="image/*" capture="user" onChange={handleSelfiePhotoChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs -mt-3">We compare your selfie against the photo on your NIMC slip.</p>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        CAC Registration Number <span className="text-gray-400 font-normal">(optional, if registered)</span>
                      </label>
                      <input
                        type="text"
                        name="cacNumber"
                        value={formData.cacNumber}
                        onChange={handleChange}
                        placeholder="RC or BN number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Live Location *</label>
                      <p className="text-gray-400 text-xs mb-2">Confirms where your shop actually operates.</p>
                      {location ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                          <Check size={16} /> Location captured
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={locating}
                          className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 hover:border-orange-300 rounded-xl text-gray-700 text-sm font-semibold transition-colors"
                        >
                          <MapPin size={16} className="text-orange-500" /> {locating ? 'Getting location...' : 'Share My Live Location'}
                        </button>
                      )}
                      {locationError && <p className="text-red-500 text-xs mt-1.5">{locationError}</p>}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all text-sm"
                      >
                        <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#0a0f2c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Questions about selling?
          </h2>
          <p className="text-gray-400 mb-8">
            Chat with us on WhatsApp and we'll answer everything!
          </p>
          <a
            href="https://wa.me/2348038786037?text=Hello! I have questions about selling on UTL Shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}

export default BecomeSeller
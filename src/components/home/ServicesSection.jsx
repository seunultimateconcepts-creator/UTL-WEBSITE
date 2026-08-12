import { Link } from 'react-router-dom'
import { Monitor, TrendingUp, ShoppingCart, ShieldCheck, Zap, Clock, Star, Check } from 'lucide-react'

function ServicesSection() {

  // ✅ To add a new service, just add a new object here.
  // icon is now a lucide-react component, not an emoji string.
  const services = [
    {
      id: 1,
      icon: Monitor,
      title: "Web Development",
      description: "From landing pages to complex web applications. We build fast, scalable and modern websites.",
      features: [
        "Frontend Development",
        "Backend Development",
        "Full Stack Solutions",
        "API Development",
      ],
      color: "blue",
      link: "/services/web-development",
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Crypto Services",
      description: "Secure crypto trading, P2P transactions, best rates and mentorship for beginners.",
      features: [
        "Buy & Sell Crypto",
        "P2P Trading",
        "Best Market Rates",
        "Mentorship & Training",
        "Check current market prices",
      ],
      color: "amber",
      link: "/services/crypto",
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: "Shopping Assistance",
      description: "Shop from any store worldwide, we handle the order and deliver to any location in Nigeria.",
      features: [
        "Jumia Orders",
        "Local Online Store Shopping",
        "International Shopping",
        "Doorstep Delivery",
        "Package Tracking",
      ],
      color: "green",
      link: "/services/shopping",
    },
  ]

  // ✅ To change trust badges, edit this array
  const trustBadges = [
    { icon: ShieldCheck, title: "Secure Transactions", desc: "Your safety is our priority" },
    { icon: Zap,         title: "Fast Delivery",       desc: "Quick and reliable service" },
    { icon: Clock,       title: "24/7 Support",         desc: "We are always here" },
    { icon: Star,        title: "Satisfaction Guaranteed", desc: "We deliver quality always" },
  ]

  // ✅ Color styles for each service card. "amber" is the featured
  // card — it gets the brand accent so Crypto Services (the highest-
  // margin, most differentiated offering) stands out from the other two.
  const colorStyles = {
    blue: {
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
      iconText: "text-blue-600",
      checkBg: "bg-blue-600",
      linkText: "text-blue-600 hover:text-blue-700",
      hover: "hover:border-blue-200",
      cardBorder: "border-gray-100",
    },
    amber: {
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-100",
      iconText: "text-amber-600",
      checkBg: "bg-amber-500",
      linkText: "text-amber-600 hover:text-amber-700",
      hover: "hover:border-amber-300",
      cardBorder: "border-amber-200",
    },
    green: {
      iconBg: "bg-emerald-50",
      iconBorder: "border-emerald-100",
      iconText: "text-emerald-600",
      checkBg: "bg-emerald-600",
      linkText: "text-emerald-600 hover:text-emerald-700",
      hover: "hover:border-emerald-200",
      cardBorder: "border-gray-100",
    },
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
            WHAT WE DO
          </p>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            We provide the best digital solutions tailored to your needs.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const style = colorStyles[service.color]
            const ServiceIcon = service.icon
            return (
              <div
                key={service.id}
                className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${style.cardBorder} ${style.hover}`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${style.iconBg} border ${style.iconBorder}`}>
                  <ServiceIcon size={26} className={style.iconText} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0 ${style.checkBg}`}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <Link
                  to={service.link}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3 ${style.linkText}`}
                >
                  Learn More
                  <span>→</span>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge) => {
            const BadgeIcon = badge.icon
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <BadgeIcon size={22} className="text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 text-sm font-semibold">{badge.title}</p>
                  <p className="text-gray-400 text-xs">{badge.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default ServicesSection
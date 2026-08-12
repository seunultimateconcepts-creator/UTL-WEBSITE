import { MessageCircle, ClipboardList, CreditCard, PartyPopper } from 'lucide-react'

function HowItWorks() {

  // ✅ To add/remove steps, just update this array. icon is a lucide-react component.
  const steps = [
    {
      number: "01",
      title: "Contact Us",
      description: "Reach out to us via WhatsApp or any of our channels.",
      icon: MessageCircle,
    },
    {
      number: "02",
      title: "Get a Quote",
      description: "We provide the best rate or solution for your needs.",
      icon: ClipboardList,
    },
    {
      number: "03",
      title: "Make Payment",
      description: "Secure payment through trusted methods.",
      icon: CreditCard,
    },
    {
      number: "04",
      title: "Receive & Enjoy",
      description: "We deliver and ensure you're satisfied.",
      icon: PartyPopper,
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
            HOW IT WORKS
          </p>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Simple Steps, Seamless Process
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Getting started with Ultimate Tech Lab is quick and easy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

          {/* ✅ Connecting dotted line between steps — only shows on desktop */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-amber-200" />

          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Circle */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border-2 border-amber-100 shadow-md flex flex-col items-center justify-center mb-6 group-hover:border-amber-400 group-hover:shadow-amber-100 transition-all duration-300">
                  <StepIcon size={22} className="text-amber-600 mb-1" />
                  <span className="text-amber-600 text-[10px] font-black tracking-wide">{step.number}</span>
                </div>

                {/* Step Title */}
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow between steps — shows on mobile only */}
                {index < steps.length - 1 && (
                  <div className="md:hidden text-amber-300 text-2xl mt-6">↓</div>
                )}

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
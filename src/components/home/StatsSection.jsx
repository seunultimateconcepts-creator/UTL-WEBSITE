import { Smile, Rocket, CalendarDays, Star } from 'lucide-react'

function StatsSection() {

  // ✅ To update your numbers, just change the values here. icon is a lucide-react component.
  const stats = [
    { value: "500+", label: "Happy Clients",       icon: Smile },
    { value: "200+", label: "Projects Completed",  icon: Rocket },
    { value: "3+",   label: "Years Experience",    icon: CalendarDays },
    { value: "99%",  label: "Client Satisfaction",  icon: Star },
  ]

  return (
    // ✅ Navy background — matches nav/hero instead of the leftover generic blue-600,
    // keeps the palette consistent across the whole page
    <section className="py-14 bg-[#0a0f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const StatIcon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
                  <StatIcon size={22} className="text-amber-400" />
                </div>

                <p className="text-white text-4xl md:text-5xl font-black mb-2">
                  {stat.value}
                </p>

                <p className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default StatsSection
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { groupedTechHubTools } from '../config/techHubTools'

function TechHub() {
  const grouped = groupedTechHubTools()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* Header */}
      <div className="bg-[#0a0f2c] py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-amber-500/[0.07] rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-semibold tracking-wide">FREE FOREVER</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            U Tech Hub
          </h1>
          <p className="text-gray-400 text-lg">
            Free tools for everyday tasks — file conversion, calculators, developer utilities and more. No signup required.
          </p>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        {Object.entries(grouped).map(([category, tools]) => (
          <div key={category}>
            <h2 className="text-xl font-black text-gray-900 mb-6">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool) => {
                const ToolIcon = tool.icon
                const CardWrapper = tool.live ? Link : 'div'
                const cardProps = tool.live ? { to: `/tech-hub/${tool.slug}` } : {}

                return (
                  <CardWrapper
                    key={tool.slug}
                    {...cardProps}
                    className={`group relative bg-white rounded-2xl p-6 border border-gray-100 transition-all ${
                      tool.live
                        ? 'hover:shadow-lg hover:-translate-y-0.5 hover:border-amber-200 cursor-pointer'
                        : 'opacity-60 cursor-default'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                      <ToolIcon size={22} className="text-amber-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{tool.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tool.description}</p>

                    {!tool.live && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </CardWrapper>
                )
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default TechHub
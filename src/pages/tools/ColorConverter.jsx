import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Palette, Copy, Check } from 'lucide-react'

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return { r, g, b }
}

function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function ColorConverter() {
  const [hex, setHex] = useState('#F5A623')
  const [copiedField, setCopiedField] = useState('')

  const rgb = hexToRgb(hex) || { r: 245, g: 166, b: 35 }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const handleHexChange = (value) => {
    const withHash = value.startsWith('#') ? value : `#${value}`
    setHex(withHash)
  }

  const handleRgbChange = (channel, value) => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0))
    const newRgb = { ...rgb, [channel]: num }
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(''), 2000)
  }

  const isValidHex = hexToRgb(hex) !== null

  const formats = [
    { label: 'HEX', value: isValidHex ? hex.toUpperCase() : 'Invalid', field: 'hex' },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, field: 'rgb' },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, field: 'hsl' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      <div className="bg-[#0a0f2c] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/tech-hub"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tech Hub
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Palette size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Color Converter</h1>
              <p className="text-gray-400 text-sm">Convert between HEX, RGB and HSL</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-4 mb-6">
            <input
              type="color"
              value={isValidHex ? hex : '#F5A623'}
              onChange={(e) => setHex(e.target.value)}
              className="w-20 h-20 rounded-2xl border-2 border-gray-100 cursor-pointer flex-shrink-0"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">HEX</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#F5A623"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-mono font-semibold focus:outline-none ${
                  isValidHex ? 'border-gray-200 focus:border-amber-400' : 'border-red-300'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {['r', 'g', 'b'].map((channel) => (
              <div key={channel}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {channel.toUpperCase()}
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {formats.map((f) => (
              <div key={f.field} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{f.label}</span>
                  <p className="font-mono text-sm text-gray-800 font-semibold">{f.value}</p>
                </div>
                <button
                  onClick={() => handleCopy(f.value, f.field)}
                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  {copiedField === f.field ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>

        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser — instant, no server needed.
        </p>
      </div>

    </div>
  )
}

export default ColorConverter
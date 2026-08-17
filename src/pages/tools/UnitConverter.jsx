import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Ruler, ArrowLeftRight } from 'lucide-react'

const CATEGORIES = {
  Length: {
    units: {
      millimeter: 0.001, centimeter: 0.01, meter: 1, kilometer: 1000,
      inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.34,
    },
  },
  Weight: {
    units: {
      milligram: 0.000001, gram: 0.001, kilogram: 1, tonne: 1000,
      ounce: 0.0283495, pound: 0.453592,
    },
  },
  Volume: {
    units: {
      milliliter: 0.001, liter: 1, cubicMeter: 1000,
      gallon: 3.78541, quart: 0.946353, cup: 0.24,
    },
  },
  Temperature: {
    units: { celsius: null, fahrenheit: null, kelvin: null },
  },
}

const LABELS = {
  millimeter: 'Millimeter (mm)', centimeter: 'Centimeter (cm)', meter: 'Meter (m)', kilometer: 'Kilometer (km)',
  inch: 'Inch (in)', foot: 'Foot (ft)', yard: 'Yard (yd)', mile: 'Mile (mi)',
  milligram: 'Milligram (mg)', gram: 'Gram (g)', kilogram: 'Kilogram (kg)', tonne: 'Tonne (t)',
  ounce: 'Ounce (oz)', pound: 'Pound (lb)',
  milliliter: 'Milliliter (mL)', liter: 'Liter (L)', cubicMeter: 'Cubic Meter (m³)',
  gallon: 'Gallon (gal)', quart: 'Quart (qt)', cup: 'Cup',
  celsius: 'Celsius (°C)', fahrenheit: 'Fahrenheit (°F)', kelvin: 'Kelvin (K)',
}

function convertTemperature(value, from, to) {
  if (from === to) return value
  let celsius
  if (from === 'celsius') celsius = value
  else if (from === 'fahrenheit') celsius = (value - 32) * (5 / 9)
  else celsius = value - 273.15

  if (to === 'celsius') return celsius
  if (to === 'fahrenheit') return celsius * (9 / 5) + 32
  return celsius + 273.15
}

function UnitConverter() {
  const [category, setCategory] = useState('Length')
  const units = Object.keys(CATEGORIES[category].units)
  const [fromUnit, setFromUnit] = useState(units[0])
  const [toUnit, setToUnit] = useState(units[1])
  const [inputValue, setInputValue] = useState('1')

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    const newUnits = Object.keys(CATEGORIES[cat].units)
    setFromUnit(newUnits[0])
    setToUnit(newUnits[1])
  }

  const result = useMemo(() => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) return ''

    if (category === 'Temperature') {
      return convertTemperature(value, fromUnit, toUnit)
    }

    const { units: unitMap } = CATEGORIES[category]
    const inBase = value * unitMap[fromUnit]
    return inBase / unitMap[toUnit]
  }, [inputValue, fromUnit, toUnit, category])

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const formatResult = (num) => {
    if (num === '') return ''
    return parseFloat(num.toFixed(6)).toString()
  }

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
              <Ruler size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Unit Converter</h1>
              <p className="text-gray-400 text-sm">Convert length, weight, temperature and volume</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  category === cat
                    ? 'bg-[#0a0f2c] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
              >
                {units.map((u) => <option key={u} value={u}>{LABELS[u]}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center my-2">
            <button
              onClick={swapUnits}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight size={16} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">To</label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm font-bold text-amber-700 flex items-center">
                {formatResult(result) || '—'}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
              >
                {units.map((u) => <option key={u} value={u}>{LABELS[u]}</option>)}
              </select>
            </div>
          </div>

        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Calculated instantly in your browser.
        </p>
      </div>

    </div>
  )
}

export default UnitConverter
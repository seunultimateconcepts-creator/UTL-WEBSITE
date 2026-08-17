import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Percent } from 'lucide-react'

function PercentageVatCalculator() {
  const [tab, setTab] = useState('percentage')

  const [pctMode, setPctMode] = useState('of')
  const [pctA, setPctA] = useState('')
  const [pctB, setPctB] = useState('')

  const [vatRate, setVatRate] = useState('7.5')
  const [vatAmount, setVatAmount] = useState('')
  const [vatDirection, setVatDirection] = useState('add')

  const pctResult = useMemo(() => {
    const a = parseFloat(pctA)
    const b = parseFloat(pctB)
    if (isNaN(a) || isNaN(b)) return null

    if (pctMode === 'of') {
      return { label: `${a}% of ${b}`, value: (a / 100) * b }
    }
    if (pctMode === 'change') {
      if (a === 0) return null
      const change = ((b - a) / a) * 100
      return { label: `Change from ${a} to ${b}`, value: change, suffix: '%', showSign: true }
    }
    if (b === 0) return null
    return { label: `${a} as a % of ${b}`, value: (a / b) * 100, suffix: '%' }
  }, [pctA, pctB, pctMode])

  const vatResult = useMemo(() => {
    const amount = parseFloat(vatAmount)
    const rate = parseFloat(vatRate)
    if (isNaN(amount) || isNaN(rate)) return null

    if (vatDirection === 'add') {
      const vatValue = amount * (rate / 100)
      return { base: amount, vat: vatValue, total: amount + vatValue }
    } else {
      const base = amount / (1 + rate / 100)
      const vatValue = amount - base
      return { base, vat: vatValue, total: amount }
    }
  }, [vatAmount, vatRate, vatDirection])

  const formatNum = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 })

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
              <Percent size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Percentage & VAT Calculator</h1>
              <p className="text-gray-400 text-sm">Quick percentage math and VAT calculations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('percentage')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'percentage' ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Percentage
          </button>
          <button
            onClick={() => setTab('vat')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'vat' ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            VAT
          </button>
        </div>

        {tab === 'percentage' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { id: 'of', label: 'X% of Y' },
                { id: 'isWhatPercent', label: 'X is what % of Y' },
                { id: 'change', label: '% change X → Y' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPctMode(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pctMode === m.id ? 'bg-amber-500 text-[#0a0f2c]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {pctMode === 'of' ? 'Percentage (X)' : 'Value X'}
                </label>
                <input
                  type="number"
                  value={pctA}
                  onChange={(e) => setPctA(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {pctMode === 'of' ? 'Of Value (Y)' : 'Value Y'}
                </label>
                <input
                  type="number"
                  value={pctB}
                  onChange={(e) => setPctB(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              {pctResult ? (
                <>
                  <p className="text-3xl font-black text-amber-700 mb-1">
                    {pctResult.showSign && pctResult.value >= 0 ? '+' : ''}
                    {formatNum(pctResult.value)}{pctResult.suffix || ''}
                  </p>
                  <p className="text-amber-600 text-xs">{pctResult.label}</p>
                </>
              ) : (
                <p className="text-gray-300 text-sm">Enter values above</p>
              )}
            </div>
          </div>
        )}

        {tab === 'vat' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex gap-2 mb-5">
              {[
                { id: 'add', label: 'Add VAT to amount' },
                { id: 'remove', label: 'Amount already includes VAT' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setVatDirection(d.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    vatDirection === d.id ? 'bg-amber-500 text-[#0a0f2c]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">VAT Rate (%)</label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {vatResult ? (
              <div className="space-y-2">
                <div className="flex justify-between px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Base Amount</span>
                  <span className="text-sm font-bold text-gray-800">₦{formatNum(vatResult.base)}</span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">VAT ({vatRate}%)</span>
                  <span className="text-sm font-bold text-gray-800">₦{formatNum(vatResult.vat)}</span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-sm font-semibold text-amber-700">Total</span>
                  <span className="text-lg font-black text-amber-700">₦{formatNum(vatResult.total)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5 text-center">
                <p className="text-gray-300 text-sm">Enter an amount above</p>
              </div>
            )}
          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-6">
          Nigeria's standard VAT rate is 7.5% — adjust if calculating for another country.
        </p>
      </div>

    </div>
  )
}

export default PercentageVatCalculator
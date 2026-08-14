/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, KeyRound, Copy, Check, RefreshCw } from 'lucide-react'

function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const LOWER = 'abcdefghijklmnopqrstuvwxyz'
  const NUMBERS = '0123456789'
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const generate = () => {
    let charset = ''
    if (useUpper) charset += UPPER
    if (useLower) charset += LOWER
    if (useNumbers) charset += NUMBERS
    if (useSymbols) charset += SYMBOLS

    if (!charset) {
      setPassword('')
      return
    }

    const randomValues = new Uint32Array(length)
    window.crypto.getRandomValues(randomValues)

    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length]
    }
    setPassword(result)
    setCopied(false)
  }

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, useUpper, useLower, useNumbers, useSymbols])

  const handleCopy = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStrength = () => {
    const varietyCount = [useUpper, useLower, useNumbers, useSymbols].filter(Boolean).length
    if (length >= 16 && varietyCount >= 3) return { label: 'Very Strong', color: 'bg-green-500', width: '100%' }
    if (length >= 12 && varietyCount >= 2) return { label: 'Strong', color: 'bg-amber-500', width: '75%' }
    if (length >= 8) return { label: 'Moderate', color: 'bg-orange-500', width: '50%' }
    return { label: 'Weak', color: 'bg-red-500', width: '25%' }
  }
  const strength = getStrength()

  const toggles = [
    { label: 'Uppercase (A-Z)', value: useUpper, set: setUseUpper },
    { label: 'Lowercase (a-z)', value: useLower, set: setUseLower },
    { label: 'Numbers (0-9)', value: useNumbers, set: setUseNumbers },
    { label: 'Symbols (!@#$)', value: useSymbols, set: setUseSymbols },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* Header */}
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
              <KeyRound size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Password Generator</h1>
              <p className="text-gray-400 text-sm">Create strong, random passwords in one click</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

          {/* Generated password display */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="flex-1 font-mono text-lg text-gray-800 break-all select-all">
              {password || '—'}
            </p>
            <button
              onClick={generate}
              title="Generate new password"
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>

          {/* Strength meter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Strength</span>
              <span className="text-xs font-semibold text-gray-700">{strength.label}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
          </div>

          {/* Length slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Length</label>
              <span className="text-sm font-bold text-amber-600">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Character type toggles */}
          <div className="space-y-2">
            {toggles.map((t) => (
              <label
                key={t.label}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{t.label}</span>
                <input
                  type="checkbox"
                  checked={t.value}
                  onChange={(e) => t.set(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
              </label>
            ))}
          </div>

        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Generated in your browser using a cryptographically secure random source — never sent anywhere.
        </p>
      </div>

    </div>
  )
}

export default PasswordGenerator
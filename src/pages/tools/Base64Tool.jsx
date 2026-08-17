import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Binary, Copy, Check, ArrowLeftRight, Trash2 } from 'lucide-react'

function Base64Tool() {
  const [mode, setMode] = useState('encode') // 'encode' | 'decode'
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const process = (value, currentMode) => {
    setInput(value)
    setCopied(false)

    if (!value) {
      setOutput('')
      setError('')
      return
    }

    try {
      if (currentMode === 'encode') {
        // ✅ btoa only handles Latin1 — encodeURIComponent/unescape trick
        // makes it safe for any UTF-8 text (emoji, accented characters, etc.)
        setOutput(btoa(unescape(encodeURIComponent(value))))
      } else {
        setOutput(decodeURIComponent(escape(atob(value))))
      }
      setError('')
    } catch {
      setOutput('')
      setError(currentMode === 'decode'
        ? 'Invalid Base64 string — check for typos or missing characters.'
        : 'Could not encode this text.')
    }
  }

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    // ✅ Swap input/output when flipping direction, so the result becomes the new input
    process(output, newMode)
  }

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* Header */}
      <div className="bg-[#0a0f2c] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/tech-hub"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tech Hub
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Binary size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Base64 Encoder / Decoder</h1>
              <p className="text-gray-400 text-sm">Convert text to and from Base64 instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className={`text-sm font-semibold ${mode === 'encode' ? 'text-amber-600' : 'text-gray-400'}`}>
            Encode
          </span>
          <button
            onClick={toggleMode}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] rounded-full transition-colors"
            title="Switch direction"
          >
            <ArrowLeftRight size={16} />
          </button>
          <span className={`text-sm font-semibold ${mode === 'decode' ? 'text-amber-600' : 'text-gray-400'}`}>
            Decode
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Input */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                {mode === 'encode' ? 'Plain Text' : 'Base64 Text'}
              </span>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => process(e.target.value, mode)}
              placeholder={mode === 'encode' ? 'Type or paste plain text here...' : 'Paste Base64 text here...'}
              spellCheck={false}
              className="w-full h-64 p-5 font-mono text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
            />
          </div>

          {/* Output */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                {error ? 'Error' : mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </span>
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="h-64 overflow-auto">
              {error && <p className="p-5 text-red-500 text-sm">{error}</p>}
              {!error && output && (
                <pre className="p-5 font-mono text-sm text-gray-800 whitespace-pre-wrap break-all">{output}</pre>
              )}
              {!error && !output && (
                <p className="p-5 text-gray-300 text-sm">Result will appear here...</p>
              )}
            </div>
          </div>

        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser — nothing is sent to any server.
        </p>
      </div>

    </div>
  )
}

export default Base64Tool
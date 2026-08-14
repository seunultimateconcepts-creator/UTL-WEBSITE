import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, FileJson, Trash2 } from 'lucide-react'

function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleFormat = (value) => {
    setInput(value)
    setCopied(false)

    if (!value.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(value)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setOutput('')
      setError(err.message)
    }
  }

  const handleCopy = () => {
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
        <div className="max-w-5xl mx-auto">
          <Link
            to="/tech-hub"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tech Hub
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <FileJson size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">JSON Formatter</h1>
              <p className="text-gray-400 text-sm">Format, validate and beautify JSON instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Input */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Input</span>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleFormat(e.target.value)}
              placeholder='Paste your JSON here, e.g. {"name": "UTL", "active": true}'
              spellCheck={false}
              className="w-full h-96 p-5 font-mono text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
            />
          </div>

          {/* Output */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                {error ? 'Error' : 'Formatted Output'}
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

            <div className="h-96 overflow-auto">
              {error && (
                <p className="p-5 text-red-500 text-sm font-mono">{error}</p>
              )}
              {!error && output && (
                <pre className="p-5 font-mono text-sm text-gray-800 whitespace-pre-wrap">{output}</pre>
              )}
              {!error && !output && (
                <p className="p-5 text-gray-300 text-sm">Formatted JSON will appear here...</p>
              )}
            </div>
          </div>

        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser — nothing is uploaded or stored anywhere.
        </p>
      </div>

    </div>
  )
}

export default JsonFormatter
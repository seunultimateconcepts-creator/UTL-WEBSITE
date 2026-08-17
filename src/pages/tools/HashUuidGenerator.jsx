import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Hash, Copy, Check, RefreshCw } from 'lucide-react'

function HashUuidGenerator() {
  const [tab, setTab] = useState('uuid') // 'uuid' | 'hash'

  // UUID state
  const [uuid, setUuid] = useState(crypto.randomUUID())
  const [uuidCopied, setUuidCopied] = useState(false)

  // Hash state
  const [hashInput, setHashInput] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [hashOutput, setHashOutput] = useState('')
  const [hashing, setHashing] = useState(false)
  const [hashCopied, setHashCopied] = useState(false)

  const generateUuid = () => {
    setUuid(crypto.randomUUID())
    setUuidCopied(false)
  }

  const copyUuid = () => {
    navigator.clipboard.writeText(uuid)
    setUuidCopied(true)
    setTimeout(() => setUuidCopied(false), 2000)
  }

  // ✅ Uses the browser's built-in SubtleCrypto API — no library needed.
  // Note: MD5 isn't offered here because it's not part of the Web Crypto
  // standard (and is cryptographically broken anyway) — SHA-256 is the
  // right default for basically everything MD5 used to be used for.
  const generateHash = async (text, algo) => {
    if (!text) {
      setHashOutput('')
      return
    }
    setHashing(true)
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest(algo, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    setHashOutput(hashHex)
    setHashing(false)
    setHashCopied(false)
  }

  const handleHashInputChange = (value) => {
    setHashInput(value)
    generateHash(value, algorithm)
  }

  const handleAlgorithmChange = (algo) => {
    setAlgorithm(algo)
    generateHash(hashInput, algo)
  }

  const copyHash = () => {
    if (!hashOutput) return
    navigator.clipboard.writeText(hashOutput)
    setHashCopied(true)
    setTimeout(() => setHashCopied(false), 2000)
  }

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
              <Hash size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Hash & UUID Generator</h1>
              <p className="text-gray-400 text-sm">Generate UUIDs or hash text with SHA algorithms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('uuid')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'uuid' ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            UUID Generator
          </button>
          <button
            onClick={() => setTab('hash')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'hash' ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Hash Generator
          </button>
        </div>

        {/* UUID Tab */}
        {tab === 'uuid' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Random UUID (v4)
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="flex-1 font-mono text-sm text-gray-800 break-all select-all">{uuid}</p>
              <button
                onClick={generateUuid}
                title="Generate new"
                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={copyUuid}
                title="Copy"
                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
              >
                {uuidCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Hash Tab */}
        {tab === 'hash' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Text to hash</label>
            <textarea
              value={hashInput}
              onChange={(e) => handleHashInputChange(e.target.value)}
              placeholder="Type or paste text here..."
              className="w-full h-24 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:border-amber-400"
            />

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Algorithm</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map((algo) => (
                <button
                  key={algo}
                  onClick={() => handleAlgorithmChange(algo)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    algorithm === algo
                      ? 'bg-amber-500 text-[#0a0f2c]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Result</label>
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[60px]">
              <p className="flex-1 font-mono text-xs text-gray-800 break-all select-all">
                {hashing ? 'Hashing...' : hashOutput || '—'}
              </p>
              {hashOutput && !hashing && (
                <button
                  onClick={copyHash}
                  title="Copy"
                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0"
                >
                  {hashCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser using native Web Crypto — nothing is sent to any server.
        </p>
      </div>

    </div>
  )
}

export default HashUuidGenerator
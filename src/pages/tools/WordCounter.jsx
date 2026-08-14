import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Type, Trash2 } from 'lucide-react'

function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()

    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length : 0
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim()).length : 0
    const readingTimeMin = words > 0 ? Math.max(1, Math.round(words / 200)) : 0

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTimeMin }
  }, [text])

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: `${stats.readingTimeMin} min` },
  ]

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
              <Type size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Word & Character Counter</h1>
              <p className="text-gray-400 text-sm">Count words, characters and estimate reading time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-black text-amber-600 mb-1">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Text area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Your Text</span>
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-72 p-5 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
          />
        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser — your text is never uploaded or stored anywhere.
        </p>
      </div>

    </div>
  )
}

export default WordCounter
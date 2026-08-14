/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, QrCode, Download } from 'lucide-react'
import QRCode from 'qrcode'

function QRGenerator() {
  const [text, setText] = useState('https://ultechlab.com')
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!text.trim()) {
      setError('')
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    QRCode.toCanvas(canvasRef.current, text, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0a0f2c',
        light: '#ffffff',
      },
    }, (err) => {
      if (err) setError('Could not generate QR code')
      else setError('')
    })
  }, [text])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
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
              <QrCode size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">QR Code Generator</h1>
              <p className="text-gray-400 text-sm">Turn any link or text into a scannable QR code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Text or URL
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com or any text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors mb-6"
          />

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="flex flex-col items-center gap-4 bg-gray-50 rounded-xl p-8">
            <canvas ref={canvasRef} className="rounded-lg" />
            <button
              onClick={handleDownload}
              disabled={!text.trim() || !!error}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a0f2c] font-bold rounded-xl transition-all text-sm"
            >
              <Download size={16} /> Download PNG
            </button>
          </div>

        </div>

        <p className="text-gray-400 text-xs text-center mt-6">
          Generated entirely in your browser — nothing is sent to any server.
        </p>
      </div>

    </div>
  )
}

export default QRGenerator
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ImageDown, Upload, Download } from 'lucide-react'

function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState(null)
  const [originalUrl, setOriginalUrl] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedUrl, setCompressedUrl] = useState('')
  const [compressedSize, setCompressedSize] = useState(0)
  const [quality, setQuality] = useState(0.7)
  const [processing, setProcessing] = useState(false)
  const canvasRef = useRef(null)

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const compress = (file, q) => {
    setProcessing(true)
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = canvasRef.current
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            setCompressedUrl(URL.createObjectURL(blob))
            setCompressedSize(blob.size)
            setProcessing(false)
          },
          'image/jpeg',
          q
        )
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setOriginalFile(file)
    setOriginalUrl(URL.createObjectURL(file))
    setOriginalSize(file.size)
    compress(file, quality)
  }

  const handleQualityChange = (value) => {
    setQuality(value)
    if (originalFile) compress(originalFile, value)
  }

  const handleDownload = () => {
    if (!compressedUrl) return
    const link = document.createElement('a')
    link.download = `compressed-${originalFile.name.replace(/\.[^.]+$/, '')}.jpg`
    link.href = compressedUrl
    link.click()
  }

  const savedPercent = originalSize && compressedSize
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-[#0a0f2c] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/tech-hub"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tech Hub
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <ImageDown size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Image Compressor</h1>
              <p className="text-gray-400 text-sm">Shrink image file size without losing much quality</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {!originalFile && (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-2xl p-16 cursor-pointer transition-colors bg-white">
            <Upload size={32} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload an image (JPG, PNG, WebP)</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        )}

        {originalFile && (
          <div className="space-y-6">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Quality</label>
                <span className="text-sm font-bold text-amber-600">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-gray-400 text-xs mt-2">Lower quality = smaller file size</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <img src={originalUrl} alt="Original" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Original</p>
                  <p className="text-lg font-black text-gray-800">{formatSize(originalSize)}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                {compressedUrl && <img src={compressedUrl} alt="Compressed" className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <p className="text-xs text-amber-500 uppercase font-semibold mb-1">Compressed</p>
                  <p className="text-lg font-black text-amber-700">
                    {processing ? 'Processing...' : formatSize(compressedSize)}
                  </p>
                  {!processing && savedPercent > 0 && (
                    <p className="text-green-600 text-xs font-semibold mt-0.5">{savedPercent}% smaller</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a0f2c] font-bold rounded-xl transition-all"
              >
                <Download size={18} /> Download Compressed
              </button>
              <label className="flex items-center justify-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl cursor-pointer transition-colors">
                New Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser — your image is never uploaded anywhere.
        </p>
      </div>

    </div>
  )
}

export default ImageCompressor
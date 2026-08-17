import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileImage, Upload, Download, X, GripVertical } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function ImagePdfConverter() {
  const [mode, setMode] = useState('imageToPdf')

  const [images, setImages] = useState([])
  const [buildingPdf, setBuildingPdf] = useState(false)

  const [pdfPages, setPdfPages] = useState([])
  const [renderingPdf, setRenderingPdf] = useState(false)
  const [pdfError, setPdfError] = useState('')

  const canvasRef = useRef(null)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages])
    e.target.value = ''
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const buildPdf = async () => {
    if (images.length === 0) return
    setBuildingPdf(true)

    const pdfDoc = await PDFDocument.create()

    for (const img of images) {
      const bytes = await img.file.arrayBuffer()
      const isPng = img.file.type === 'image/png'
      const embedded = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes)
      const page = pdfDoc.addPage([embedded.width, embedded.height])
      page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height })
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'images-to-pdf.pdf'
    link.click()

    setBuildingPdf(false)
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setRenderingPdf(true)
    setPdfError('')
    setPdfPages([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pages = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = canvasRef.current
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        pages.push({ pageNum: i, dataUrl: canvas.toDataURL('image/png') })
      }

      setPdfPages(pages)
    } catch {
      setPdfError('Could not read this PDF. It may be corrupted or password-protected.')
    } finally {
      setRenderingPdf(false)
      e.target.value = ''
    }
  }

  const downloadPage = (page) => {
    const link = document.createElement('a')
    link.href = page.dataUrl
    link.download = `page-${page.pageNum}.png`
    link.click()
  }

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
              <FileImage size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Image ⇄ PDF Converter</h1>
              <p className="text-gray-400 text-sm">Convert images to PDF, or PDF pages to images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('imageToPdf')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'imageToPdf' ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Image → PDF
          </button>
          <button
            onClick={() => setMode('pdfToImage')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'pdfToImage' ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            PDF → Image
          </button>
        </div>

        {mode === 'imageToPdf' && (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-2xl p-10 cursor-pointer transition-colors bg-white">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to add images (JPG or PNG, multiple allowed)</span>
              <input type="file" accept="image/jpeg,image/png" multiple onChange={handleImageUpload} className="hidden" />
            </label>

            {images.length > 0 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-1">
                    {images.length} image{images.length > 1 ? 's' : ''} — will appear in this order
                  </p>
                  {images.map((img) => (
                    <div key={img.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2">
                      <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                      <img src={img.url} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-700 truncate">{img.file.name}</span>
                      <button onClick={() => removeImage(img.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={buildPdf}
                  disabled={buildingPdf}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-200 text-[#0a0f2c] font-bold rounded-xl transition-all"
                >
                  <Download size={18} /> {buildingPdf ? 'Building PDF...' : 'Download as PDF'}
                </button>
              </>
            )}
          </div>
        )}

        {mode === 'pdfToImage' && (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-2xl p-10 cursor-pointer transition-colors bg-white">
              {renderingPdf ? (
                <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={24} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {renderingPdf ? 'Rendering pages...' : 'Click to upload a PDF'}
              </span>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={renderingPdf} className="hidden" />
            </label>

            {pdfError && <p className="text-red-500 text-sm text-center">{pdfError}</p>}

            {pdfPages.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {pdfPages.map((page) => (
                  <div key={page.pageNum} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="w-full h-40 object-contain bg-gray-50" />
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Page {page.pageNum}</span>
                      <button
                        onClick={() => downloadPage(page)}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-6">
          Everything runs in your browser — your files are never uploaded to any server.
        </p>
      </div>

    </div>
  )
}

export default ImagePdfConverter
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileStack, Upload, Download, X, GripVertical, Info } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

function PdfToolkit() {
  const [mode, setMode] = useState('merge')

  const [mergeFiles, setMergeFiles] = useState([])
  const [merging, setMerging] = useState(false)

  const [splitFile, setSplitFile] = useState(null)
  const [splitting, setSplitting] = useState(false)
  const [splitResults, setSplitResults] = useState([])
  const [splitError, setSplitError] = useState('')

  const [compressFile, setCompressFile] = useState(null)
  const [compressing, setCompressing] = useState(false)
  const [compressResult, setCompressResult] = useState(null)
  const [compressError, setCompressError] = useState('')

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleMergeUpload = (e) => {
    const files = Array.from(e.target.files)
    setMergeFiles((prev) => [...prev, ...files.map((f) => ({ id: Date.now() + Math.random(), file: f }))])
    e.target.value = ''
  }
  const removeMergeFile = (id) => setMergeFiles((prev) => prev.filter((f) => f.id !== id))

  const doMerge = async () => {
    if (mergeFiles.length < 2) return
    setMerging(true)
    const mergedPdf = await PDFDocument.create()

    for (const { file } of mergeFiles) {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((p) => mergedPdf.addPage(p))
    }

    const outBytes = await mergedPdf.save()
    const blob = new Blob([outBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'merged.pdf'
    link.click()
    setMerging(false)
  }

  const handleSplitUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSplitFile(file)
    setSplitError('')
    setSplitResults([])
    setSplitting(true)

    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pageCount = pdf.getPageCount()
      const results = []

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create()
        const [page] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(page)
        const outBytes = await newPdf.save()
        const blob = new Blob([outBytes], { type: 'application/pdf' })
        results.push({ pageNum: i + 1, url: URL.createObjectURL(blob) })
      }

      setSplitResults(results)
    } catch {
      setSplitError('Could not read this PDF. It may be corrupted or password-protected.')
    } finally {
      setSplitting(false)
      e.target.value = ''
    }
  }

  const downloadSplitPage = (page) => {
    const link = document.createElement('a')
    link.href = page.url
    link.download = `page-${page.pageNum}.pdf`
    link.click()
  }

  const handleCompressUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCompressFile(file)
    setCompressError('')
    setCompressResult(null)
    setCompressing(true)

    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const outBytes = await pdf.save({ useObjectStreams: true })
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      setCompressResult({
        originalSize: file.size,
        newSize: outBytes.length,
        url: URL.createObjectURL(blob),
      })
    } catch {
      setCompressError('Could not process this PDF. It may be corrupted or password-protected.')
    } finally {
      setCompressing(false)
      e.target.value = ''
    }
  }

  const downloadCompressed = () => {
    if (!compressResult) return
    const link = document.createElement('a')
    link.href = compressResult.url
    link.download = `compressed-${compressFile.name}`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

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
              <FileStack size={22} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">PDF Toolkit</h1>
              <p className="text-gray-400 text-sm">Merge, split, or compress PDF files</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex gap-2 mb-6">
          {[
            { id: 'merge', label: 'Merge' },
            { id: 'split', label: 'Split' },
            { id: 'compress', label: 'Compress' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === m.id ? 'bg-[#0a0f2c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'merge' && (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-2xl p-10 cursor-pointer transition-colors bg-white">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to add PDF files (2 or more, in the order you want them merged)</span>
              <input type="file" accept=".pdf" multiple onChange={handleMergeUpload} className="hidden" />
            </label>

            {mergeFiles.length > 0 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                  {mergeFiles.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-700 truncate">{f.file.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatSize(f.file.size)}</span>
                      <button onClick={() => removeMergeFile(f.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={doMerge}
                  disabled={merging || mergeFiles.length < 2}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a0f2c] font-bold rounded-xl transition-all"
                >
                  <Download size={18} /> {merging ? 'Merging...' : `Merge ${mergeFiles.length} PDFs`}
                </button>
                {mergeFiles.length < 2 && (
                  <p className="text-gray-400 text-xs text-center">Add at least 2 files to merge</p>
                )}
              </>
            )}
          </div>
        )}

        {mode === 'split' && (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-2xl p-10 cursor-pointer transition-colors bg-white">
              {splitting ? (
                <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={24} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {splitting ? 'Splitting pages...' : 'Click to upload a PDF — each page becomes its own file'}
              </span>
              <input type="file" accept=".pdf" onChange={handleSplitUpload} disabled={splitting} className="hidden" />
            </label>

            {splitError && <p className="text-red-500 text-sm text-center">{splitError}</p>}

            {splitResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {splitFile?.name} — {splitResults.length} pages
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {splitResults.map((page) => (
                    <button
                      key={page.pageNum}
                      onClick={() => downloadSplitPage(page)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Download size={12} /> Page {page.pageNum}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'compress' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-blue-700 text-xs leading-relaxed">
                This optimizes the PDF's internal structure — it works best on text-heavy documents. PDFs with large embedded images will see a smaller reduction, since deep image recompression needs a server-side tool.
              </p>
            </div>

            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-amber-300 rounded-2xl p-10 cursor-pointer transition-colors bg-white">
              {compressing ? (
                <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={24} className="text-gray-400" />
              )}
              <span className="text-sm text-gray-500">
                {compressing ? 'Compressing...' : 'Click to upload a PDF'}
              </span>
              <input type="file" accept=".pdf" onChange={handleCompressUpload} disabled={compressing} className="hidden" />
            </label>

            {compressError && <p className="text-red-500 text-sm text-center">{compressError}</p>}

            {compressResult && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Original</p>
                    <p className="text-lg font-black text-gray-800">{formatSize(compressResult.originalSize)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-amber-500 uppercase font-semibold mb-1">Compressed</p>
                    <p className="text-lg font-black text-amber-700">{formatSize(compressResult.newSize)}</p>
                  </div>
                </div>
                <button
                  onClick={downloadCompressed}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] font-bold rounded-xl transition-all"
                >
                  <Download size={18} /> Download Compressed PDF
                </button>
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

export default PdfToolkit
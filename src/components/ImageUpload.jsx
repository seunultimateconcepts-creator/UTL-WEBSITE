/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * ImageUpload
 *
 * Uploads directly from the browser to Cloudinary using an UNSIGNED
 * preset — no backend endpoint needed, no API secret exposed client-side
 * (unsigned presets are scoped/restricted on Cloudinary's side, not by
 * anything we control here).
 *
 * Usage: <ImageUpload value={url} onChange={(url) => ...} label="..." />
 */
export default function ImageUpload({ value, onChange, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      e.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large — 10MB maximum')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()

      if (!data.secure_url) {
        setError('Upload failed — please try again')
        return
      }
      onChange(data.secure_url)
    } catch (err) {
      console.error('Cloudinary upload failed:', err)
      setError('Upload failed — check your connection and try again')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer transition-colors">
          {uploading ? (
            <Loader2 size={22} className="text-orange-500 animate-spin" />
          ) : (
            <>
              <Upload size={20} className="text-gray-400" />
              <span className="text-gray-500 text-xs font-medium">{label}</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
      )}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  )
}
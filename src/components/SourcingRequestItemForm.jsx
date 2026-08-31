import { useState } from 'react'
import ImageUpload from './ImageUpload'

/**
 * SourcingRequestItemForm
 *
 * Usage: <SourcingRequestItemForm platform="Jumia" onAdd={(item) => ...} onCancel={() => ...} />
 */
export default function SourcingRequestItemForm({ platform, onAdd, onCancel }) {
  const [description, setDescription] = useState('')
  const [referenceImageUrl, setReferenceImageUrl] = useState('')
  const [budget, setBudget] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) {
      setError('Describe what you want')
      return
    }
    onAdd({
      platform,
      description: description.trim(),
      referenceImageUrl,
      budget: budget ? Number(budget) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
          What do you want from {platform}? *
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Tecno Spark 20 Pro, 8GB RAM 256GB, black"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
          Reference image (optional)
        </label>
        <ImageUpload value={referenceImageUrl} onChange={setReferenceImageUrl} label="Upload a screenshot" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
          Your budget (optional)
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="₦ e.g. 150000"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors text-sm"
        >
          Add to Cart
        </button>
      </div>
    </form>
  )
}
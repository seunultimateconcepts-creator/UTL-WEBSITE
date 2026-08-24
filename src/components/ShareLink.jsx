import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'

/**
 * ShareLink
 *
 * Drop this on any page that should be shareable — vendor stores,
 * product pages, UTL Market itself. Uses the native share sheet where
 * available (mobile), falls back to copy-to-clipboard + a WhatsApp
 * shortcut everywhere else.
 *
 * Usage:
 * <ShareLink url={window.location.href} title="Check out this product" />
 */
export default function ShareLink({ url, title = 'Check this out on Ultimate Tech Lab', className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        // User cancelled the share sheet — not an error, do nothing
        if (err.name !== 'AbortError') console.error('Share failed:', err)
      }
      return
    }

    // Desktop fallback — copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700 hover:text-orange-700 text-sm font-semibold rounded-xl transition-all ${className}`}
    >
      {copied ? (
        <><Check size={15} className="text-green-600" /> Link copied</>
      ) : navigator.share ? (
        <><Share2 size={15} /> Share</>
      ) : (
        <><Copy size={15} /> Copy link</>
      )}
    </button>
  )
}
/**
 * compressImageToBase64.js
 *
 * ✅ Resizes and compresses an image entirely in the browser, then
 * returns it as a base64 string — no upload to Cloudinary or any
 * other storage happens here. Used specifically for the NIMC slip
 * photo and selfie in BecomeSeller.jsx, which need to travel to admin
 * for a one-time check and then exist nowhere, matching the same
 * "verify, don't store" principle already applied to NIN/BVN text.
 *
 * Keeps images to a reasonable size (max 1000px wide, JPEG quality
 * 0.7) so two photos plus the rest of the application email stays
 * comfortably under typical email size limits.
 */
export function compressImageToBase64(file, maxWidth = 1000, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const scale = Math.min(1, maxWidth / img.width)
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
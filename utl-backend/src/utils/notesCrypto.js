/**
 * notesCrypto.js
 *
 * Zero-knowledge encryption for the Notepad tool. Everything here runs
 * entirely in the browser using the native Web Crypto API — no library,
 * no network call. The server NEVER sees: the passphrase, the derived
 * key, or any plaintext. It only ever stores what encryptText/
 * encryptBytes produce (ciphertext + iv), which are useless without
 * the passphrase.
 *
 * ⚠️ There is no recovery mechanism by design. If the passphrase is
 * lost, the notes are permanently unreadable — that's not a bug, it's
 * what makes "not even the developer can access it" true. Any
 * recovery path would mean someone holds a spare key.
 */

const PBKDF2_ITERATIONS = 250000
const VERIFY_STRING = 'UTL_NOTES_VERIFY_OK'

function bufToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function base64ToBuf(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
}

export function generateSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return bufToBase64(salt)
}

// ✅ Turns a human passphrase into a real AES key. Same passphrase +
// same salt always produces the same key — that's what lets us
// re-derive it on every unlock without ever storing it anywhere.
export async function deriveKey(passphrase, saltBase64) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: base64ToBuf(saltBase64),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(plaintext, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext))
  return { ciphertext: bufToBase64(ciphertext), iv: bufToBase64(iv) }
}

export async function decryptText(ciphertextBase64, ivBase64, key) {
  const plainBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBuf(ivBase64) }, key, base64ToBuf(ciphertextBase64)
  )
  return new TextDecoder().decode(plainBuf)
}

export async function encryptBytes(arrayBuffer, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, arrayBuffer)
  return { ciphertext: bufToBase64(ciphertext), iv: bufToBase64(iv) }
}

export async function decryptBytes(ciphertextBase64, ivBase64, key) {
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBuf(ivBase64) }, key, base64ToBuf(ciphertextBase64)
  )
}

// ✅ One-time setup — generates a fresh salt, derives a key from the
// chosen passphrase, encrypts a known string as a way to verify the
// passphrase on future unlocks without ever sending it anywhere.
export async function setupVault(passphrase) {
  const salt = generateSalt()
  const key = await deriveKey(passphrase, salt)
  const { ciphertext, iv } = await encryptText(VERIFY_STRING, key)
  return { salt, verifyCiphertext: ciphertext, verifyIv: iv, key }
}

// ✅ Unlock — re-derives the key from the entered passphrase + stored
// salt, tries decrypting the stored verify blob. Throws on wrong
// passphrase, returns a usable key on success.
export async function unlockVault(passphrase, salt, verifyCiphertext, verifyIv) {
  const key = await deriveKey(passphrase, salt)
  let decrypted
  try {
    decrypted = await decryptText(verifyCiphertext, verifyIv, key)
  } catch {
    throw new Error('Incorrect passphrase')
  }
  if (decrypted !== VERIFY_STRING) throw new Error('Incorrect passphrase')
  return key
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock, ShieldAlert, Plus, Trash2, Download, StickyNote,
  FileText, Upload, ArrowLeft, Save, Eye, EyeOff,
} from 'lucide-react'
import {
  setupVault as cryptoSetupVault, unlockVault, encryptText, decryptText,
  encryptBytes, decryptBytes,
} from '../../utils/notesCrypto'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB — matches the backend cap

function Notepad() {
  const [checking, setChecking] = useState(true)
  const [vaultExists, setVaultExists] = useState(false)
  const [vaultMeta, setVaultMeta] = useState(null) // { salt, verifyCiphertext, verifyIv }
  const [key, setKey] = useState(null) // CryptoKey — held in memory only, never persisted

  const token = () => localStorage.getItem('utl_token')

  useEffect(() => {
    const checkVault = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notes/vault-status`, {
          headers: { Authorization: `Bearer ${token()}` },
        })
        const data = await res.json()
        if (data.success) {
          setVaultExists(data.isSetup)
          if (data.isSetup) setVaultMeta(data)
        }
      } catch (err) {
        console.error('Vault status check failed:', err)
      } finally {
        setChecking(false)
      }
    }
    checkVault()
  }, [])

  if (checking) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (key) {
    return <NotesWorkspace notesKey={key} onLock={() => setKey(null)} />
  }

  return vaultExists ? (
    <UnlockScreen vaultMeta={vaultMeta} onUnlocked={setKey} />
  ) : (
    <SetupScreen onCreated={(newKey, meta) => { setKey(newKey); setVaultMeta(meta) }} />
  )
}

// ──────────────────────────────────────────────────────────────
// SETUP SCREEN — first visit only, big unmissable warning
// ──────────────────────────────────────────────────────────────
function SetupScreen({ onCreated }) {
  const [passphrase, setPassphrase] = useState('')
  const [confirm, setConfirm] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    if (!acknowledged) {
      setError('You must confirm you understand this before continuing')
      return
    }
    if (passphrase.length < 8) {
      setError('Use at least 8 characters')
      return
    }
    if (passphrase !== confirm) {
      setError('Passphrases do not match')
      return
    }

    setLoading(true)
    try {
      const { salt, verifyCiphertext, verifyIv, key } = await cryptoSetupVault(passphrase)

      const res = await fetch(`${BASE_URL}/notes/vault-setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('utl_token')}`,
        },
        body: JSON.stringify({ salt, verifyCiphertext, verifyIv }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Something went wrong')
        return
      }

      onCreated(key, { salt, verifyCiphertext, verifyIv })
    } catch (err) {
      console.error('Vault setup failed:', err)
      setError('Something went wrong setting up your notepad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-10">
        <Link to="/tech-hub" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Tech Hub
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
              <StickyNote size={20} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Set Up Your Notepad</h1>
              <p className="text-gray-500 text-sm">Create a passphrase — this happens only once.</p>
            </div>
          </div>

          {/* Unmissable warning — not a small print footnote */}
          <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <ShieldAlert size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-800 text-sm leading-relaxed">
              <p className="font-bold mb-1">This passphrase cannot be recovered. Ever.</p>
              <p>
                Your notes are encrypted on your own device before they're saved — not even UTL
                can read them. That also means if you forget this passphrase, <strong>your notes
                are permanently lost</strong>. There is no "forgot passphrase" option, no support
                ticket that can help, no way around it. Write it down somewhere safe.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notes Passphrase</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors pr-11"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm Passphrase</label>
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type it again"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
              />
              <span className="text-gray-600 text-xs leading-relaxed">
                I understand that if I forget this passphrase, my notes are permanently lost with no way to recover them.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm"
            >
              {loading ? 'Setting Up...' : 'Create My Notepad'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// UNLOCK SCREEN — every return visit
// ──────────────────────────────────────────────────────────────
function UnlockScreen({ vaultMeta, onUnlocked }) {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleUnlock = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const key = await unlockVault(passphrase, vaultMeta.salt, vaultMeta.verifyCiphertext, vaultMeta.verifyIv)
      onUnlocked(key)
    } catch (err) {
      setError('Incorrect passphrase')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-sm w-full px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-amber-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-1">Notepad Locked</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your passphrase to unlock your notes.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-left">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Notes passphrase"
                autoFocus
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors pr-11"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !passphrase}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 text-[#0a0f2c] font-bold rounded-xl transition-colors text-sm"
            >
              {loading ? 'Unlocking...' : 'Unlock'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// WORKSPACE — unlocked notes list + editor, all decrypt/encrypt
// happens right here using the in-memory key
// ──────────────────────────────────────────────────────────────
function NotesWorkspace({ notesKey, onLock }) {
  const [notes, setNotes] = useState([])
  const [decryptedTitles, setDecryptedTitles] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeNote, setActiveNote] = useState(null) // decrypted note being viewed/edited
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const token = () => localStorage.getItem('utl_token')

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/notes`, { headers: { Authorization: `Bearer ${token()}` } })
      const data = await res.json()
      if (data.success) {
        setNotes(data.notes)
        // Decrypt just the titles for the list view
        const titles = {}
        for (const note of data.notes) {
          try {
            titles[note._id] = await decryptText(note.titleCiphertext, note.titleIv, notesKey)
          } catch {
            titles[note._id] = '⚠️ Could not decrypt'
          }
        }
        setDecryptedTitles(titles)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotes() }, [])

  const openNote = async (note) => {
    setError('')
    try {
      const title = decryptedTitles[note._id]
      let content = ''
      if (note.type === 'text') {
        content = await decryptText(note.contentCiphertext, note.contentIv, notesKey)
      }
      setActiveNote({ ...note, title, content })
    } catch (err) {
      setError('Could not decrypt this note')
    }
  }

  const handleNewTextNote = () => {
    setActiveNote({ _id: null, type: 'text', title: '', content: '' })
  }

  const handleSaveNote = async () => {
    if (!activeNote.title.trim()) {
      setError('Give your note a title')
      return
    }
    setError('')
    try {
      const { ciphertext: titleCiphertext, iv: titleIv } = await encryptText(activeNote.title, notesKey)
      const { ciphertext: contentCiphertext, iv: contentIv } = await encryptText(activeNote.content, notesKey)

      const isNew = !activeNote._id
      const url = isNew ? `${BASE_URL}/notes` : `${BASE_URL}/notes/${activeNote._id}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          type: 'text', titleCiphertext, titleIv, contentCiphertext, contentIv,
          sizeBytes: new Blob([activeNote.content]).size,
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to save')
        return
      }
      setActiveNote(null)
      fetchNotes()
    } catch (err) {
      console.error('Save failed:', err)
      setError('Something went wrong saving this note')
    }
  }

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note permanently?')) return
    try {
      await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      })
      setActiveNote(null)
      fetchNotes()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  // ✅ Client-side type check only. This is a UX guardrail, not a
  // security boundary — since content is encrypted before it ever
  // reaches the server, the server structurally cannot verify file
  // content type either. A determined technical user could bypass
  // this check; it's here to stop accidental/casual misuse, not to
  // enforce a real content policy.
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setError('Images and videos are not supported here — documents only.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large — 8MB maximum.')
      e.target.value = ''
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const { ciphertext: titleCiphertext, iv: titleIv } = await encryptText(file.name, notesKey)
      const { ciphertext: contentCiphertext, iv: contentIv } = await encryptBytes(arrayBuffer, notesKey)

      const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          type: 'document', titleCiphertext, titleIv, contentCiphertext, contentIv,
          sizeBytes: file.size,
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Upload failed')
        return
      }
      fetchNotes()
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Something went wrong uploading this file')
    } finally {
      e.target.value = ''
    }
  }

  const handleDownload = async (note) => {
    try {
      const title = decryptedTitles[note._id]
      const decrypted = await decryptBytes(note.contentCiphertext, note.contentIv, notesKey)
      const blob = new Blob([decrypted])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Could not decrypt this file')
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <StickyNote size={20} className="text-amber-600" /> Your Notepad
            </h1>
            <p className="text-gray-400 text-xs mt-1">Encrypted on your device — persists forever, readable only by you.</p>
          </div>
          <button onClick={onLock} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm">
            <Lock size={14} /> Lock
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!activeNote && (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={handleNewTextNote}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] text-sm font-bold rounded-xl transition-colors"
              >
                <Plus size={15} /> New Note
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-amber-300 text-gray-700 text-sm font-bold rounded-xl transition-colors"
              >
                <Upload size={15} /> Upload Document
              </button>
              <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls" />
            </div>

            {loading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && notes.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <StickyNote size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-400 text-sm">No notes yet — create your first one above.</p>
              </div>
            )}

            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <button onClick={() => openNote(note)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    {note.type === 'document' ? (
                      <FileText size={18} className="text-blue-500 flex-shrink-0" />
                    ) : (
                      <StickyNote size={18} className="text-amber-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-gray-900 font-medium text-sm truncate">{decryptedTitles[note._id] || '...'}</p>
                      <p className="text-gray-400 text-xs">{new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                  </button>
                  {note.type === 'document' && (
                    <button onClick={() => handleDownload(note)} className="text-gray-400 hover:text-amber-600 flex-shrink-0">
                      <Download size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(note._id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeNote && activeNote.type === 'text' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setActiveNote(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-2">
                {activeNote._id && (
                  <button onClick={() => handleDelete(activeNote._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={handleSaveNote}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0a0f2c] text-xs font-bold rounded-lg transition-colors"
                >
                  <Save size={13} /> Save
                </button>
              </div>
            </div>
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
              placeholder="Note title"
              className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 border-0 border-b border-gray-100 pb-3 mb-4 focus:outline-none focus:border-amber-400"
            />
            <textarea
              value={activeNote.content}
              onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
              placeholder="Start writing..."
              rows={14}
              className="w-full text-sm text-gray-700 placeholder-gray-300 border-0 focus:outline-none resize-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Notepad
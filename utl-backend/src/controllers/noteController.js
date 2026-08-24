/* eslint-disable no-undef */
const Note = require('../models/note')
const User = require('../models/user')

// ✅ Kept safely under MongoDB's 16MB per-document hard limit —
// base64 inflates raw bytes by ~33%, plus other fields need headroom.
const MAX_FILE_BYTES = 8 * 1024 * 1024

// ✅ VAULT STATUS — tells the frontend whether to show "set a
// passphrase" (first visit) or "enter your passphrase" (returning)
const getVaultStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notesVault')
    const isSetup = !!user?.notesVault?.salt

    res.status(200).json({
      success: true,
      isSetup,
      salt: user?.notesVault?.salt || null,
      verifyCiphertext: user?.notesVault?.verifyCiphertext || null,
      verifyIv: user?.notesVault?.verifyIv || null,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking vault', error: error.message })
  }
}

// ✅ SETUP VAULT — one-time, not editable afterward through this
// endpoint. The server just stores whatever the browser computed —
// it never sees the passphrase that produced it.
const setupVault = async (req, res) => {
  try {
    const { salt, verifyCiphertext, verifyIv } = req.body
    if (!salt || !verifyCiphertext || !verifyIv) {
      return res.status(400).json({ success: false, message: 'Missing vault setup data' })
    }

    const user = await User.findById(req.user.id)
    if (user.notesVault?.salt) {
      return res.status(400).json({ success: false, message: 'Vault already set up' })
    }

    user.notesVault = { salt, verifyCiphertext, verifyIv }
    await user.save()

    res.status(200).json({ success: true, message: 'Vault created' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error setting up vault', error: error.message })
  }
}

// ✅ CREATE NOTE — body must already be encrypted client-side
const createNote = async (req, res) => {
  try {
    const { type, titleCiphertext, titleIv, contentCiphertext, contentIv, sizeBytes } = req.body

    if (!titleCiphertext || !titleIv || !contentCiphertext || !contentIv) {
      return res.status(400).json({ success: false, message: 'Missing encrypted content' })
    }
    if (sizeBytes && sizeBytes > MAX_FILE_BYTES) {
      return res.status(400).json({ success: false, message: 'File exceeds the 8MB limit' })
    }

    const note = await Note.create({
      userId: req.user.id,
      type: type || 'text',
      titleCiphertext,
      titleIv,
      contentCiphertext,
      contentIv,
      sizeBytes: sizeBytes || 0,
    })

    res.status(201).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating note', error: error.message })
  }
}

// ✅ GET MY NOTES — returns encrypted blobs only; decryption happens
// entirely client-side after this
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, notes })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching notes', error: error.message })
  }
}

// ✅ UPDATE NOTE
const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params
    const { titleCiphertext, titleIv, contentCiphertext, contentIv, sizeBytes } = req.body

    if (sizeBytes && sizeBytes > MAX_FILE_BYTES) {
      return res.status(400).json({ success: false, message: 'File exceeds the 8MB limit' })
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user.id },
      { titleCiphertext, titleIv, contentCiphertext, contentIv, sizeBytes },
      { new: true }
    )

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' })
    }

    res.status(200).json({ success: true, note })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating note', error: error.message })
  }
}

// ✅ DELETE NOTE
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params
    const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user.id })

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting note', error: error.message })
  }
}

module.exports = { getVaultStatus, setupVault, createNote, getMyNotes, updateNote, deleteNote }
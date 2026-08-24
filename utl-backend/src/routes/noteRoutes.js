/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const {
  getVaultStatus, setupVault, createNote, getMyNotes, updateNote, deleteNote,
} = require('../controllers/noteController')
const { protect } = require('../middleware/authMiddleware')

router.get('/vault-status', protect, getVaultStatus)   // GET /api/notes/vault-status
router.post('/vault-setup', protect, setupVault)        // POST /api/notes/vault-setup
router.get('/', protect, getMyNotes)                    // GET /api/notes
router.post('/', protect, createNote)                   // POST /api/notes
router.put('/:noteId', protect, updateNote)              // PUT /api/notes/:noteId
router.delete('/:noteId', protect, deleteNote)           // DELETE /api/notes/:noteId

module.exports = router
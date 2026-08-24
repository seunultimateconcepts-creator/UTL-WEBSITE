/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Note
 *
 * Every field that could reveal content is encrypted client-side
 * before it ever reaches here — including the title, deliberately,
 * since an unencrypted title would leak information even with the
 * body protected. sizeBytes is the only plaintext metadata, kept
 * purely to enforce the storage cap server-side.
 */
const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'document'],
    default: 'text',
  },
  titleCiphertext: { type: String, required: true },
  titleIv: { type: String, required: true },
  contentCiphertext: { type: String, required: true }, // note body OR file bytes, both encrypted+base64
  contentIv: { type: String, required: true },
  sizeBytes: { type: Number, default: 0 }, // plaintext — needed to enforce the 8MB cap
}, {
  timestamps: true,
})

module.exports = mongoose.model('Note', noteSchema)
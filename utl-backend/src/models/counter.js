/* eslint-disable no-undef */
const mongoose = require('mongoose')

/**
 * Counter
 *
 * Generic atomic sequence generator. One document per counter name
 * (e.g. 'order', later 'booking'). Uses findOneAndUpdate with $inc,
 * which MongoDB guarantees is atomic — two requests arriving at the
 * exact same millisecond still get different numbers, unlike counting
 * existing documents and adding 1.
 */
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'order'
  seq: { type: Number, default: 0 },
})

const Counter = mongoose.model('Counter', counterSchema)

/**
 * getNextSequence('order') → 1, 2, 3... atomically, safe under concurrency
 */
const getNextSequence = async (counterName) => {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  return counter.seq
}

module.exports = { Counter, getNextSequence }
/* eslint-disable no-undef */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationExpire: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: function () {
      return !this.googleId && !this.facebookId
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.facebookId
    },
    minlength: 8,
  },

  googleId: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },

  // ✅ Every signup is a single base type now. No more picking
  // Client/Seller/Learner/Crypto at signup — those distinctions are now
  // handled by the two fields below instead.
  accountType: {
    type: String,
    enum: ['client'],
    default: 'client',
  },

  // ✅ Selling is an UPGRADE, not an account type. Set to 'pending' when
  // someone submits the Become a Seller application, flipped to
  // 'approved'/'rejected' manually in Atlas (see handover note plan).
  // Dashboard.jsx checks this — NOT accountType — to decide whether to
  // show seller tabs.
  sellerStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  },

  // ✅ Gates access to /dashboard entirely. Starts false for every new
  // signup. Flips to true the first time the user places an order
  // (see orderController — TODO once a real Order model exists;
  // interim version flips this from the frontend, see UTLShopStore.jsx).
  dashboardUnlocked: {
    type: Boolean,
    default: false,
  },

  // ✅ Prefills the checkout address form on future orders — NOT a
  // multi-address book (that's more than this needs right now), just
  // "remember what they typed last time" convenience. Overwritten
  // every time they complete checkout with a new address.
  lastDeliveryAddress: {
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    coverageZone: { type: String, default: '' },
    address: { type: String, default: '' },
    landmark: { type: String, default: '' },
  },

  avatar: {
    type: String,
    default: null,
  },

  // ✅ Vendor storefront profile — bio/address/photo auto-fill the
  // vendor's About/Contact pages, collected once at application time
  // instead of hand-written per page.
  vendorProfile: {
    shopName: { type: String, default: '' },
    businessCategory: { type: String, default: 'Product Seller' },
    bio: { type: String, default: '' },
    shopAddress: { type: String, default: '' },
    shopPhotoUrl: { type: String, default: '' }, // Cloudinary
  },
  // ✅ Verification data — deliberately does NOT include NIN or BVN.
  // Those get emailed directly to admin for one-time manual
  // cross-checking and are NEVER written to this or any other
  // collection. CAC is public record; live location is low-sensitivity
  // — both are fine to store normally. sellerStatus (already existing)
  // remains the single source of truth for approved/pending/rejected;
  // this block is just supporting context for that decision.
  verification: {
    cacNumber: { type: String, default: '' },
    liveLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    submittedAt: { type: Date, default: null },
  },
  // ✅ Zero-knowledge notepad vault. salt + verifyCiphertext/verifyIv are
  // the ONLY things stored here — never the passphrase, never the
  // derived encryption key. See notesCrypto.js on the frontend for how
  // these get used. If a user forgets this passphrase, their notes are
  // permanently unreadable by design — there is no recovery mechanism,
  // and there deliberately cannot be one.
  notesVault: {
    salt: { type: String, default: null },
    verifyCiphertext: { type: String, default: null },
    verifyIv: { type: String, default: null },
  },
  // ✅ Vendor subscription tier. Manually set by admin for now (until
  // Paystack collection is built) — mirrors the same "manual for now,
  // automate once it's proven" pattern used elsewhere in this build.
  // expiresAt is the yearly anniversary date — pay Sept 20 2026, next
  // payment due Sept 20 2027, not a rolling 365-day window from
  // "whenever we happened to check."
  subscription: {
    tier: { type: String, enum: ['free', 'silver', 'gold', 'platinum'], default: 'free' },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
}, {
  timestamps: true,
})

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User
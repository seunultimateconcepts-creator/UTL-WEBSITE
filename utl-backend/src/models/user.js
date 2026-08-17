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

  accountType: {
    type: String,
    enum: ['client', 'seller', 'learner', 'crypto'],
    default: 'client',
  },
  accountTypeConfirmed: {
    type: Boolean,
    default: true,
  },

  avatar: {
    type: String,
    default: null,
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
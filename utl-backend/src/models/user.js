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
//password reset fields
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
    required: [true, 'Phone number is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  accountType: {
    type: String,
    enum: ['client', 'seller', 'learner', 'crypto'],
    default: 'client',
  },
  avatar: {
    type: String,
    default: null,
  },

}, {
  timestamps: true,
})

// ✅ Hash password before saving
// ✅ Hash password before saving
// ✅ Hash password before saving
// ✅ Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})


// ✅ Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}


const user = mongoose.model('user', userSchema)


module.exports = user
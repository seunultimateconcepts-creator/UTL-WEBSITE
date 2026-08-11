/* eslint-disable no-undef */
const crypto = require('crypto')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const { welcomeEmail, verificationEmail, passwordResetEmail } = require('../utils/emailTemplates')

// ✅ Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

// ✅ SIGNUP
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, accountType } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    // ✅ Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpire = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    const user = await User.create({
      firstName, lastName, email, phone, password, accountType,
      verificationToken,
      verificationExpire,
    })

    // ✅ Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
    await sendEmail({
      to: user.email,
      subject: 'Verify your Ultimate Tech Lab account',
      html: verificationEmail(user.firstName, verifyUrl),
    })

    // ✅ Also send welcome email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Ultimate Tech Lab! 🎉',
      html: welcomeEmail(user.firstName),
    })

    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message,
    })
  }
}

// ✅ VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findOne({
      verificationToken: token,
      verificationExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link',
      })
    }

    // ✅ Mark as verified
    user.isVerified = true
    user.verificationToken = null
    user.verificationExpire = null
    await user.save()

    const jwtToken = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      token: jwtToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      error: error.message,
    })
  }
}

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // ✅ Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox!',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    })
  }
}

// ✅ FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // ✅ Don't reveal if email exists or not — security best practice
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      })
    }
    

    // ✅ Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // ✅ Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendEmail({
      to: user.email,
      subject: 'Reset your Ultimate Tech Lab password',
      html: passwordResetEmail(user.firstName, resetUrl),
    })

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email!',
    })
  } catch (error) {
  console.error('Forgot password error:', error) // ✅ Add this
  res.status(500).json({
    success: false,
    message: 'Server error during password reset',
    error: error.message,
  })
}
}

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link',
      })
    }

    // ✅ Update password — pre-save hook will hash it
    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login.',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message,
    })
  }
}

// ✅ GET ME
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = { signup, verifyEmail, login, forgotPassword, resetPassword, getMe }
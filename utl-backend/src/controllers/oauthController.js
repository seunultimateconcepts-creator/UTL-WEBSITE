/* eslint-disable no-undef */
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Missing Google credential' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, given_name, family_name, picture } = payload

    let user = await User.findOne({ $or: [{ googleId }, { email }] })

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId
        if (!user.avatar) user.avatar = picture
        await user.save()
      }
    } else {
      user = await User.create({
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        email,
        googleId,
        avatar: picture,
        isVerified: true,
        accountTypeConfirmed: false,
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Signed in with Google',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        accountTypeConfirmed: user.accountTypeConfirmed,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Google auth error:', error.message)
    res.status(401).json({
      success: false,
      message: 'Google sign-in failed',
      error: error.message,
    })
  }
}

const completeProfile = async (req, res) => {
  try {
    const { accountType } = req.body

    if (!['client', 'seller'].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: 'accountType must be either "client" or "seller"',
      })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.accountType = accountType
    user.accountTypeConfirmed = true
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile completed',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        accountTypeConfirmed: user.accountTypeConfirmed,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error completing profile',
      error: error.message,
    })
  }
}

module.exports = { googleAuth, completeProfile }
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

// ✅ NOTE: accountType/accountTypeConfirmed removed throughout this file.
// Those fields predate the sellerStatus-based architecture used
// everywhere else in this build — this file just never got updated
// when that changed. A Google/Facebook sign-in now behaves exactly
// like a normal email signup: one plain account, sellerStatus
// defaults to 'none', no separate "complete profile" step.
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
        sellerStatus: user.sellerStatus,
        dashboardUnlocked: user.dashboardUnlocked,
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

const facebookAuth = async (req, res) => {
  try {
    const { accessToken } = req.body

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Missing Facebook access token' })
    }

    const fbResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture.type(large)&access_token=${accessToken}`
    )
    const fbData = await fbResponse.json()

    if (fbData.error) {
      return res.status(401).json({
        success: false,
        message: 'Facebook token verification failed',
        error: fbData.error.message,
      })
    }

    const { id: facebookId, first_name, last_name, email, picture } = fbData

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Your Facebook account has no email available. Please sign up with email/Google instead.',
      })
    }

    let user = await User.findOne({ $or: [{ facebookId }, { email }] })

    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId
        if (!user.avatar && picture?.data?.url) user.avatar = picture.data.url
        await user.save()
      }
    } else {
      user = await User.create({
        firstName: first_name || 'Facebook',
        lastName: last_name || 'User',
        email,
        facebookId,
        avatar: picture?.data?.url || null,
        isVerified: true,
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Signed in with Facebook',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        sellerStatus: user.sellerStatus,
        dashboardUnlocked: user.dashboardUnlocked,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Facebook auth error:', error.message)
    res.status(401).json({
      success: false,
      message: 'Facebook sign-in failed',
      error: error.message,
    })
  }
}

module.exports = { googleAuth, facebookAuth }
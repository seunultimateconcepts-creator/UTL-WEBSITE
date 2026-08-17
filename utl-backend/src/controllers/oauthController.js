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

// ✅ GOOGLE SIGN-IN
// Frontend sends the ID token it got from Google Identity Services / One Tap.
// We verify it directly with Google (never trust a token without verifying
// it server-side — anyone could send a fake one otherwise).
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

    // ✅ Look for an existing account two ways:
    // 1. Already linked to this Google account
    // 2. Signed up before with the same email (link the accounts instead
    //    of creating a duplicate — same person, different login method)
    let user = await User.findOne({ $or: [{ googleId }, { email }] })

    if (user) {
      // ✅ Existing email-only account logging in with Google for the
      // first time — link it so future logins work either way
      if (!user.googleId) {
        user.googleId = googleId
        if (!user.avatar) user.avatar = picture
        await user.save()
      }
    } else {
      // ✅ Brand new user — accountTypeConfirmed: false triggers the
      // "Client or Seller?" step on the frontend before they see the dashboard
      user = await User.create({
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        email,
        googleId,
        avatar: picture,
        isVerified: true, // ✅ Google already verified their email for us
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

module.exports = { googleAuth }
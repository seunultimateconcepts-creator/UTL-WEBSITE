/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    let token

    // ✅ Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      })
    }

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ✅ Find the user and attach to request
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid token', error: error.message,
    })
  }
}

module.exports = { protect }
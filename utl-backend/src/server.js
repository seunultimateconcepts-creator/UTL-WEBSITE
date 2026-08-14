/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

// ✅ Load environment variables
dotenv.config()
  

const app = express()

// ✅ Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://utl-website.vercel.app',
    'https://ultechlab.com',
    'https://www.ultechlab.com'
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ Routes — we'll add more here
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/contact', require('./routes/contactRoutes'))
app.use('/api/news', require('./routes/newsRoutes'))

// ✅ Health check — visit this to confirm server is running
app.get('/', (req, res) => {
  res.json({
    status: 'UTL Backend is running! 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// ✅ Connect to MongoDB then start server
const PORT = process.env.PORT || 5000


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    console.log('📦 Database:', mongoose.connection.db.databaseName)
    app.listen(PORT, () => {
      console.log(`✅ UTL Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

module.exports = app
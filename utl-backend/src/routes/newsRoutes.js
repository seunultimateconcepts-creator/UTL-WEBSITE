/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const { getNews } = require('../controllers/newsController')

// ✅ GET /api/news/crypto  |  /api/news/tech  |  /api/news/nigeria
router.get('/:category', getNews)

module.exports = router
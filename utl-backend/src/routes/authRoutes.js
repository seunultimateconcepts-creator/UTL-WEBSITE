/* eslint-disable no-undef */

const express = require('express')
const router = express.Router()


router.get('/test', (req, res) => {
    res.status(200).json({message: 'Auth route is working!'})
})

module.exports = router
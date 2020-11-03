const express = require('express')
const router = express.Router()

router.use('/coingekko', require('./coingekko'))
module.exports = router
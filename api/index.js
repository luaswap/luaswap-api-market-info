const express = require('express')
const router = express.Router()

router.use('/coingecko', require('./coingecko'))
module.exports = router
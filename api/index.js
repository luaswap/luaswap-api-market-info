const express = require('express')
const router = express.Router()

router.use('/coingecko', require('./coingecko'))
router.use('/coinmarketcap', require('./coinmarketcap'))
module.exports = router
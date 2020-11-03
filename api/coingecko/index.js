const express = require('express')
const router = express.Router()


router.use('/pairs', require('./pair'))
router.use('/tickers', require('./ticker'))
router.use('/orderbook', require('./orderbook'))
router.use('/historical_trades', require('./historicalTrade'))
module.exports = router
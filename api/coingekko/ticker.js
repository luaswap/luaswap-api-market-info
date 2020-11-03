const express = require('express')
const router = express.Router()
const _ = require('lodash')

const {
  getTickers
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  let tickers = await getTickers()
  let dataResCoinGekko =  _.map(tickers, ticker => {
    return {
      "ticker_id": ticker.token0.id + '_' + ticker.token1.id,
      "base_currency": ticker.token0.symbol,
      "target_currency": ticker.token1.symbol,
      "last_price": ticker.price,
      "base_volume": ticker.previous24hVolumeToken0,
      "target_volume": ticker.previous24hVolumeToken1,
      "bid": "0",
      "ask": "0",
      "high": "0",
      "low": "0"
    }
  })

  res.json(dataResCoinGekko)
}))

module.exports = router
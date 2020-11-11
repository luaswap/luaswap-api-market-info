const express = require('express')
const BigNumber = require('bignumber.js')
const router = express.Router()
const { getAddress } = require("@ethersproject/address")
const computeBidsAsks = require('../utils/computeBidsAsks')
const _ = require('lodash')

const {
  getTickers
} = require('./query')

router.get('/', ASYNC(async (req, res) => {

  // Get data 
  let tickers = await getTickers()

  // Create data tickers to return coingecko
  let dataResCoingecko =  _.map(tickers, ticker => {

    // Calculate best bid, ask price
    let orderbook = computeBidsAsks(new BigNumber(ticker.reserve0), new BigNumber(ticker.reserve1), 4000)
    let bestBid = orderbook.bids.length > 0 ? orderbook.bids[0][0] : '0'
    let bestAsk = orderbook.asks.length > 0 ? orderbook.asks[0][0] : '0'

    let id0 = getAddress(ticker.token0.id)
    let id1 = getAddress(ticker.token1.id)
    return {
      "ticker_id": id0 + '_' + id1,
      "base_currency": ticker.token0.symbol,
      "target_currency": ticker.token1.symbol,
      "last_price": ticker.price,
      "base_volume": ticker.previous24hVolumeToken0,
      "target_volume": ticker.previous24hVolumeToken1,
      "bid": bestBid,
      "ask": bestAsk,
      "high": "0",
      "low": "0"
    }
  })

  res.json(dataResCoingecko)
}))

module.exports = router
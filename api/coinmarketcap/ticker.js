const express = require('express')
const router = express.Router()
const { getAddress } = require('@ethersproject/address')
const _ = require('lodash')

const {
  getTickers
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  let tickers = await getTickers()
  let dataResCoinMarketCap = _.reduce(tickers, (summary, ticker) => {
    let id0 = getAddress(ticker.token0.id)
    let id1 = getAddress(ticker.token1.id)
    summary[`${id0}_${id1}`] = {
      'base_id': id0,
      'base_name': ticker.token0.name,
      'base_symbol': ticker.token0.symbol,
      'quote_id': id1,
      'quote_name': ticker.token1.name,
      'quote_symbol': ticker.token1.symbol,
      'last_price': ticker.price ? ticker.price : '0',
      'base_volume': ticker.previous24hVolumeToken0,
      'quote_volume': ticker.previous24hVolumeToken1
    }

    return summary
  }, {})
  res.json(dataResCoinMarketCap)
}))

module.exports = router
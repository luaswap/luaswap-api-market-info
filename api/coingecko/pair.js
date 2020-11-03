const express = require('express')
const router = express.Router()
const _ = require('lodash')

const {
  getPairs
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  let pairs = await getPairs()
  let dataResCoingecko = _.map(pairs, pair => {
    return {
      "ticker_id": pair.token0.id + '_' + pair.token1.id,
      "base": pair.token0.symbol,
      "target": pair.token1.symbol
    }
  })
  res.json(dataResCoingecko)
}))

module.exports = router
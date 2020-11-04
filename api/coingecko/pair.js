const express = require('express')
const router = express.Router()
const { getAddress } = require("@ethersproject/address")
const _ = require('lodash')

const {
  getPairs
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  let pairs = await getPairs()
  let dataResCoingecko = _.map(pairs, pair => {
    let id0 = getAddress(pair.token0.id)
    let id1 = getAddress(pair.token1.id)
    return {
      "ticker_id": id0 + '_' + id1,
      "base": pair.token0.symbol,
      "target": pair.token1.symbol
    }
  })
  res.json(dataResCoingecko)
}))

module.exports = router
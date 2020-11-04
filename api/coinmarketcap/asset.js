const express = require('express')
const router = express.Router()
const { getAddress } = require("@ethersproject/address")
const _ = require('lodash')

const {
  getPairs
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  let pairs = await getPairs()
  let dataResCoinMarketCap = _.reduce(pairs, (asset, pair) => {
    let id0 = getAddress(pair.token0.id)
    let id1 = getAddress(pair.token1.id)
    if(!asset[id0]) {
      asset[id0] = {
        'id': id0,
        'name': pair.token0.name,
        'symbol': pair.token0.symbol,
        'maker_fee': '0',
        'taker_fee': '0.004'
      }
    }

    if(!asset[id1]) {
      asset[id1] = {
        'id': id1,
        'name': pair.token1.name,
        'symbol': pair.token1.symbol,
        'maker_fee': '0',
        'taker_fee': '0.004'
      }
    }

    return asset
  }, {})
  res.json(dataResCoinMarketCap)
}))

module.exports = router
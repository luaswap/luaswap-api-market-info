const express = require('express')
const router = express.Router()
const _ = require('lodash')

const {
  getOrderBook
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  if (!req.query.ticker_id || !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(req.query.ticker_id)) {
    throw new Error('Invalid ticker_id identifier: must be of format tokenAddress_tokenAddress')
  }

  let depthDefault = 4000
  if(req.query.depth !== '0' && _.trim(req.query.depth)) {
    depthDefault = parseInt(req.query.depth / 2)
  }

  const [tokenA, tokenB] = req.query.ticker_id.split('_')
  let orderbook =  await getOrderBook(tokenA, tokenB, 10000)
  let dataResCoingecko = {
    "ticker_id": req.query.ticker_id,
    ...orderbook
  }
  res.json(dataResCoingecko)
}))

module.exports = router
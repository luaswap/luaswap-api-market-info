const express = require('express')
const router = express.Router()
const _ = require('lodash')

const {
  getOrderBook
} = require('./query')

router.get('/:marketPair', ASYNC(async (req, res) => {
  if (!req.params.marketPair || !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(req.params.marketPair)) {
    throw new Error('Invalid market_pair identifier: must be of format tokenAddress_tokenAddress')
  }

  let depthDefault = 200
  if(req.query.depth !== '0' && _.trim(req.query.depth)) {
    depthDefault = parseInt(req.query.depth / 2)
  }

  const [tokenA, tokenB] = req.params.marketPair.split('_')
  let orderbook =  await getOrderBook(tokenA, tokenB, depthDefault)
  let dataResCoingecko = {
    'timestamp': new Date().getTime(),
    ...orderbook
  }
  res.json(dataResCoingecko)
}))

module.exports = router
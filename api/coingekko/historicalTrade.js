const express = require('express')
const BigNumber = require('bignumber.js')
const router = express.Router()
const _ = require('lodash')

const {
  getSwaps
} = require('./query')

router.get('/', ASYNC(async (req, res) => {
  if (!req.query.ticker_id || !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(req.query.ticker_id)) {
    throw new Error('Invalid ticker_id identifier: must be of format tokenAddress_tokenAddress')
  }

  if (!req.query.type || (req.query.type !== 'buy' && req.query.type !== 'sell')) {
    throw new Error('Invalid type identifier: must be of buy or sell')
  }

  let limitDefault = 0
  if(_.trim(req.query.limit)) {
    limitDefault = parseInt(req.query.limit)
  }

  const [tokenA, tokenB] = req.query.ticker_id.split('_')
  let swaps =  await getSwaps(tokenA, tokenB, req.query.type, limitDefault)
  let dataResCoinGekko = {}
  dataResCoinGekko[req.query.type] = _.map(swaps, swap => {
    const aOut = swap.amount0Out !== '0'
    const bOut = swap.amount1Out !== '0'
    const baseAmount = aOut ? swap.amount0Out : swap.amount0In
    const quoteAmount = bOut ? swap.amount1Out : swap.amount1In
    return  {        
      "trade_id": swap.id,
      "type": req.query.type,
      "trade_timestamp": swap.timestamp,
      "base_volume": baseAmount,
      "target_volume": quoteAmount,
      "price": baseAmount !== '0' ? new BigNumber(quoteAmount).dividedBy(new BigNumber(baseAmount)).toString() : undefined,
    }

  })
  res.json(dataResCoinGekko)
}))

module.exports = router
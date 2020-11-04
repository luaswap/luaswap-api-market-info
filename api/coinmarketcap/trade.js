const express = require('express')
const BigNumber = require('bignumber.js')
const router = express.Router()
const _ = require('lodash')

const {
  getSwaps
} = require('./query')

router.get('/:marketPair', ASYNC(async (req, res) => {
  if (!req.params.marketPair || !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(req.params.marketPair)) {
    throw new Error('Invalid market_pair identifier: must be of format tokenAddress_tokenAddress')
  }

  const [tokenA, tokenB] = req.params.marketPair.split('_')
  let swaps =  await getSwaps(tokenA, tokenB)
  let dataResCoingecko = {}
  dataResCoingecko[req.query.type] = _.map(swaps, swap => {
    const aIn = swap.amount0In !== '0'
    const aOut = swap.amount0Out !== '0'
    const bIn = swap.amount1In !== '0'
    const bOut = swap.amount1Out !== '0'

    // a is the base so if the pair sends a and not b then it's a 'buy'
    const isBuy = aOut && bIn && !aIn && !bOut
    const isSell = !aOut && !bIn && aIn && bOut
    const isBorrowBoth = aOut && bOut && aIn && bIn

    const type = isBuy ? 'buy' : isSell ? 'sell' : isBorrowBoth ? 'borrow-both' : '???'
    const baseAmount = aOut ? swap.amount0Out : swap.amount0In
    const quoteAmount = bOut ? swap.amount1Out : swap.amount1In
    return  {        
      'trade_id': swap.id,
      'type': type,
      'trade_timestamp': swap.timestamp,
      'base_volume': baseAmount,
      'quote_volume': quoteAmount,
      "price": baseAmount !== '0' ? new BigNumber(quoteAmount).dividedBy(new BigNumber(baseAmount)).toString() : undefined,
    }

  })
  res.json(dataResCoingecko)
}))

module.exports = router
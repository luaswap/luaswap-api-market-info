const express = require('express')
const router = express.Router()
const { getAddress } = require("@ethersproject/address")
const _ = require('lodash')

const {
  getTickers, getOrderBook
} = require('./query')

router.get('/', ASYNC(async (req, res) => {

  // Get data 
  let tickers = await getTickers()

  // Get data bids, ask
  let tokenABList = _.map(tickers, ticker => {
    return {tokenA: ticker.token0.id, tokenB: ticker.token1.id}
  })
  let orderbookCallArr = _.reduce(tokenABList, (orderbookCallArr, tokenAB) => {
    orderbookCallArr.push(new Promise(async (resolve, reject) => {
      try {
        let orderbookEachPairData = await getOrderBook(tokenAB.tokenA, tokenAB.tokenB, 400)
        resolve({
          ...tokenAB,
          'bid': orderbookEachPairData.bids.length > 0 ? orderbookEachPairData.bids[0][0] : '0',
          'ask': orderbookEachPairData.asks.length > 0 ? orderbookEachPairData.asks[0][0] : '0'
        })
      } catch (error) {
        reject({
          ...tokenAB,
          'bid': '0',
          'ask': '0'
        })
      }
    }))
    return orderbookCallArr
  }, [])
  let bidAsks = await Promise.all(orderbookCallArr)


  // Create data tickers to return coingecko
  let dataResCoingecko =  _.map(tickers, ticker => {
    let bidask = _.find(bidAsks, bidAsk => {
      if(bidAsk.tokenA === ticker.token0.id 
          && bidAsk.tokenB === ticker.token1.id) {
            return bidAsk  
          }
    })

    let id0 = getAddress(ticker.token0.id)
    let id1 = getAddress(ticker.token1.id)
    return {
      "ticker_id": id0 + '_' + id1,
      "base_currency": ticker.token0.symbol,
      "target_currency": ticker.token1.symbol,
      "last_price": ticker.price,
      "base_volume": ticker.previous24hVolumeToken0,
      "target_volume": ticker.previous24hVolumeToken1,
      "bid": bidask ? bidask.bid : "0",
      "ask": bidask ? bidask.ask : "0",
      "high": "0",
      "low": "0"
    }
  })

  res.json(dataResCoingecko)
}))

module.exports = router
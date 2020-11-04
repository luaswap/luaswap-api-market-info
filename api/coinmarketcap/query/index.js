const axios = require('axios')
const _ = require('lodash')
const computeBidsAsks = require('../../utils/computeBidsAsks')
const BigNumber = require('bignumber.js')
const config = require('config')
const clientUrl = config.get('thegraph.client')
const blockClientUrl = config.get('thegraph.blockClient')

/**
 * Returns the block corresponding to a given epoch timestamp (seconds)
 * @param timestamp epoch timestamp in seconds
 */
async function getBlockFromTimestamp(timestamp) {
    let result = await axios.post(blockClientUrl, {
        query: `
        {
            blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: ${timestamp} }) {
                id,
                number,
                timestamp
            }
        }  
        `
    })
    if (!result || result.data.errors || result.data.data.blocks.length == 0) {
        throw new Error('Failed to fetch block number from the subgraph.')
    }
    return result.data.data.blocks[0].number
}

const getPairs = async() => {
    let result = await axios.post(clientUrl, {
        query: `
        {
            pairs(orderBy: reserveUSD, orderDirection: desc) {
                id,
                token0 {
                    id,
                    name,
                    symbol
                },
                token1 {
                    id,
                    name,
                    symbol
                },
                createdAtTimestamp
            }
        }  
        `
    })
    if (!result || result.data.errors) {
        throw new Error('Failed to fetch pair from the subgraph.')
    }
    return result.data.data.pairs
}

const getTickers = async() => {

    // Query Pair data
    let resultPairData = await axios.post(clientUrl, {
        query: `
        {
            pairs(orderBy: reserveUSD, orderDirection: desc) {
                id,
                token0 {
                    id,
                    name,
                    symbol
                },
                token1 {
                    id,
                    name,
                    symbol
                },
                reserve0,
                reserve1,
                volumeToken0,
                volumeToken1
            }
        }  
        `
    })
    if (!resultPairData || resultPairData.data.errors) {
        throw new Error('Failed to fetch pairs from the subgraph.')
    }

    let pairs = resultPairData.data.data.pairs
    if (!pairs && pairs.length == 0) {
        throw new Error('Pair list from subgraph is empty.')
    }
    let pairIds = _.map(pairs, pair => pair.id)
    let pairIdStr = pairIds.join('","')
    let epochSecond = Math.floor(new Date().getTime() / 1000)
    let firstBlock = await getBlockFromTimestamp(epochSecond - 86400)

    // Query pair volume data
    let resultPairVolumeData = await axios.post(clientUrl, {
        query: `
        {
            pairs(first: ${pairIds.length}, where: { id_in: ["${pairIdStr}"] }, block: { number: ${firstBlock} }    ) {
                id,
                volumeToken0,
                volumeToken1
            }
        }  
        `
    })
    let pairVolumes = resultPairVolumeData.data.data.pairs

    // Calculate tickers data
    let yesterdayVolumeIndex = _.reduce(pairVolumes, (dict, pairVolume) => {
        dict[pairVolume.id] = { volumeToken0: new BigNumber(pairVolume.volumeToken0), volumeToken1: new BigNumber(pairVolume.volumeToken1) }
        return dict
    }, {})
    let tickers = _.map(pairs, pair => {
        let yesterday = yesterdayVolumeIndex[pair.id]
        return {
            ...pair,
            price:
                pair.reserve0 != '0' && pair.reserve1 != '0'
                    ? new BigNumber(pair.reserve1).dividedBy(pair.reserve0).toString()
                    : undefined,
            previous24hVolumeToken0:
                pair.volumeToken0 && yesterday
                    ? new BigNumber(pair.volumeToken0).minus(yesterday.volumeToken0).toString()
                    : new BigNumber(pair.volumeToken0).toString(),
            previous24hVolumeToken1:
                pair.volumeToken1 && yesterday
                    ? new BigNumber(pair.volumeToken1).minus(yesterday.volumeToken1).toString()
                    : new BigNumber(pair.volumeToken1).toString()
        }
    })

    return tickers
}

const getOrderBook = async(tokenA, tokenB, depth = 200) => {

    tokenA = _.toLower(tokenA)
    tokenB = _.toLower(tokenB)
    // Query pair reserve by tokens
    let pairReseveData = await axios.post(clientUrl, {
        query: `
        {
            pairs(where: { token0: "${tokenA}", token1: "${tokenB}" }) {
                id,
                reserve0,
                reserve1
            }
        }  
        `
    })
    if (!pairReseveData || pairReseveData.data.errors || pairReseveData.data.data.pairs.length == 0) {
        throw new Error('Failed to fetch pairs reserve from the subgraph.')
    }

    let [reservesA, reservesB] = [pairReseveData.data.data.pairs[0].reserve0, pairReseveData.data.data.pairs[0].reserve1]
    const timestamp = new Date().getTime()

    return {
        timestamp,
        ...computeBidsAsks(new BigNumber(reservesA), new BigNumber(reservesB), depth)
    }
}

const getSwaps = async(tokenA, tokenB) => {

    tokenA = _.toLower(tokenA)
    tokenB = _.toLower(tokenB)
    // Query pair from tokens
    let pairData = await axios.post(clientUrl, {
        query: `
        {
            pairs(where: { token0: "${tokenA}", token1: "${tokenB}" }) {
                id
            }
        }  
        `
    })
    if (!pairData || pairData.data.errors || pairData.data.data.pairs.length == 0) {
        throw new Error('Failed to fetch pairs from the subgraph.')
    }
    let pairAddress = pairData.data.data.pairs[0].id

    // Query swap data
    let _24HoursAgo = Math.floor((Date.now() - (24 * 60 * 60 * 1000)) / 1000)
    let swapData = await axios.post(clientUrl, {
        query: `
            {
                swaps(
                    orderBy: timestamp,
                    orderDirection: asc,
                    where: {
                        timestamp_gte: ${_24HoursAgo},
                        pair:"${pairAddress}"
                    }) 
                {
                    id,
                    timestamp,
                    amount0In,
                    amount0Out,
                    amount1In,
                    amount1Out
                } 
            }
        `
    })
    if (!swapData || swapData.data.errors) {
        throw new Error('Failed to fetch swaps from the subgraph.')
    }

    return swapData.data.data.swaps
}

module.exports = {
    getPairs,
    getTickers,
    getOrderBook,
    getSwaps
}
const express = require('express')
const _ = require('lodash')
const router = express.Router()
const rateLimit = require("express-rate-limit")
const limiterMarket = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    handler: function (req, res, next) {
        res.status(429).json({
            status: 429,
            message: 'Too many requests, please try again later.'
        })
    }
})

const limiterEachPair = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // limit each ticker_id to 10 requests per windowMs
            // if don't have ticker_id param in request, limit by ip
    keyGenerator: function (req /*, res*/) {
        return (req.ticker_id && _.trim(req.ticker_id)) ? _.trim(req.ticker_id) : req.ip
    },
    handler: function (req, res, next) {
        res.status(429).json({
            status: 429,
            message: 'Too many requests, please try again later.'
        })
    }
})

const limiterEachPairByIp = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: function (req, res, next) {
        res.status(429).json({
            status: 429,
            message: 'Too many requests, please try again later.'
        })
    }
})

router.use('/summary', limiterMarket, require('./summary'))
router.use('/assets', limiterMarket, require('./asset'))
router.use('/ticker', limiterMarket, require('./ticker'))
router.use('/orderbook', limiterMarket, require('./orderbook'))
module.exports = router
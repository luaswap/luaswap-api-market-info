require('./customConsole')
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const config = require('config')
global.ASYNC = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
const port = config.get("port") || 8889

// Begin setting common config for request, response
const app = express()
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// End setting common config for request, response


// Begin setting api
app.enable('trust proxy')
app.use('/api', require('./api'))
app.use('/api', require('./middlewares/error'))
// End setting api


// Begin setting server-api
const server = app.listen(port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server start at http://${host}:${port}`)
})
// End setting server-api

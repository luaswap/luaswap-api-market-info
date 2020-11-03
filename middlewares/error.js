const _ = require('lodash')
function getErrorMessage(ex) {
  try {
    var data = _.get(ex, 'response.data');
    if (data) {
      var errors = data.errors;
      if (Array.isArray(errors)) {
        return errors[0]
      }
      else if (typeof errors == 'object') {
        var key = Object.keys(errors)[0];
        return errors[key][0]
      }
    }
    else {
      return ''
    }
  }
  catch (ex) {
    return ''
  }
}

module.exports = function(error, req, res, next) {
  if (error) {
    var err = typeof error != 'object' ? {} : error;
    err.status = error.status || _.get(error, 'data.status') || _.get(error, 'response.data.status') || 406
    err.message = getErrorMessage(error) ||
      error.message ||
      (error.data && error.data.message) ||
      'Not Acceptable'

    console.error({
      URL: req.url,
      query: req.query,
      params: req.params,
      body: JSON.stringify(_.omit(req.body, ['password', 'accessToken', 'refreshToken', 'authorization', 'Authorization']), null, 4),
      message: error.message,
      rawMessage: error.toString && error.toString(),
      requestTo: {
        url: _.get(error, 'config.url'),
        method: _.get(error, 'config.method'),
        data: _.get(error, 'config.data')
      },
      stack: error.stack
    })

    return res.status(500).json({
      status: 500,
      message: 'Server Internal Error.'
    })
  }
  return next()
}

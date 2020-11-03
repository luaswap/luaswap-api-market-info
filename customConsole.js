var moment = require('moment-timezone')
var t = () => moment(new Date()).tz('Asia/Ho_Chi_Minh').format('YYYY/MM/DD HH:mm:ss');
var console_error = console.error
var console_log = console.log
var console_warn = console.warn
var console_info = console.info
console.error = function() { console_error('\x1b[31m', `[${t()}] `, ...arguments, '\x1b[0m') }
console.warn = function() { console_warn('\x1b[33m', `[${t()}] `, ...arguments, '\x1b[0m') }
console.log = function() { console_log('\x1b[0m', `[${t()}] `, ...arguments, '\x1b[0m') }
console.info = function() { console_info('\x1b[34m', `[${t()}] `, ...arguments, '\x1b[0m') }
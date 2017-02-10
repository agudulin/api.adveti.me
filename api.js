const microApi = require('micro-api')
const { getSeason } = require('./handlers')

const api = microApi([{
  method: 'get',
  path: '/season/:season',
  handler: getSeason
}])

module.exports = api

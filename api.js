const microApi = require('micro-api')

const handlers = require('./handlers')

const api = microApi([{
  method: 'get',
  path: '/season/:season',
  handler: handlers.getSeason
}, {
  method: 'get',
  path: '/grab/season/:season',
  handler: handlers.noop // handlers.grabSeason
}])

module.exports = api

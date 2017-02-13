const microApi = require('micro-api')

const handlers = require('./handlers')

const api = microApi([{
  method: 'get',
  path: '/season/:season',
  handler: handlers.getSeason
}, {
  method: 'get',
  path: '/season/:season/grab',
  handler: handlers.noop // handlers.grabSeason
}, {
  method: 'get',
  path: '/season/:season/episode/:episode/poster.jpg',
  handler: handlers.getPoster
}])

module.exports = api

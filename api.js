const microApi = require('micro-api')

const { getSeason, grabSeason } = require('./handlers')

const api = microApi([{
  method: 'get',
  path: '/season/:season',
  handler: getSeason
}, {
  method: 'get',
  path: '/grab/season/:season',
  handler: grabSeason
}])

module.exports = api

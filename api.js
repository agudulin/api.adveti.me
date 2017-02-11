const microApi = require('micro-api')
const data = require('./data.json')

const api = microApi([{
  method: 'get',
  path: '/season/:season',
  handler: ({ params: { season } }) => (
    data.episodes.filter(e => e.season === parseInt(season, 10))
  )
}])

module.exports = api

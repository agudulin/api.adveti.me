const data = require('./data.json')

const getSeason = ({ params: { season } }) => {
  console.log(`> requesting season ${season}`)

  return data.episodes.filter(e => e.season === parseInt(season, 10))
}

module.exports = { getSeason }

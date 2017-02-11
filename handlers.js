const { parseFullSeason } = require('./grabber')

const grabSeason = ({ params: { season } }) => parseFullSeason(season)
const getSeason = ({ params: { season } }) => require(`./data/${season}.json`)

module.exports = { getSeason, grabSeason }

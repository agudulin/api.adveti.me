const { getSeasonData } = require('./db')
const { parseFullSeason } = require('./grabber')

const grabSeason = ({ params: { season } }) => parseFullSeason(season)
const getSeason = ({ params: { season } }) => getSeasonData(season)
const noop = () => {}

module.exports = { getSeason, grabSeason, noop }

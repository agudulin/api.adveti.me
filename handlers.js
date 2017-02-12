const { parseFullSeason } = require('./grabber')

const grabSeason = ({ params: { season } }) => parseFullSeason(season)
const getSeason = ({ params: { season } }) => require(`./data/${season}.json`)
const noop = () => {}

module.exports = { getSeason, grabSeason, noop }

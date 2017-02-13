const stream = require('send')

const { parseFullSeason } = require('./grabber')

const getPoster = ({ req, res, params: { season, episode } }) => stream(req, `./data/${season}/${episode}.jpg`).pipe(res)
const grabSeason = ({ params: { season } }) => parseFullSeason(season)
const getSeason = ({ params: { season } }) => require(`./data/${season}/data.json`)
const noop = () => {}

module.exports = { getPoster, getSeason, grabSeason, noop }

const cheerio = require('cheerio')
const request = require('request-promise')

const parseSeasonPage = (season) => new Promise((resolve) => {
  const url = `http://advetime.ru/category/sezon-${season}`
  const linkSelector = '.type_category .cell-content .wrap h4 a'

  return request(url).then(body => {
    const $ = cheerio.load(body)
    const links = $(linkSelector)

    const episodes = links.map((_, link) => ({
      name: $(link).text(),
      url: $(link).attr('href')
    })).get()

    resolve(episodes)
  })
})

const parseEpisodePage = ({ name, url }) => new Promise((resolve) => {
  const tabsSelector = '.type_page_content .tabs_widget'
  const voiceTitleSelector = '.elem span'

  return request(url).then(body => {
    const $ = cheerio.load(body)
    const tabs = $(tabsSelector).last()

    const titles = tabs.find(voiceTitleSelector)
      .map((_, title) => $(title).text())
      .get()
    const links = tabs.find('script').map((_, script) => {
      const scriptText = $(script).html()
      const urlMatch = scriptText.match(/file:"(.+?)"/)
      const url = urlMatch && urlMatch[1]

      return url
    }).get()

    const videos = titles.map((title, i) => ({
      name: title,
      url: links[i]
    }))

    resolve({ name, url, videos })
  })
})

const parseFullSeason = (season) => new Promise((resolve) => {
  parseSeasonPage(season).then(episodes =>
    Promise.all(episodes.map(parseEpisodePage)).then(resolve)
  )
})

module.exports = { parseFullSeason }

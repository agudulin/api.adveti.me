const fs = require('fs')
const im = require('imagemagick')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const request = require('request-promise')

const { setSeasonData } = require('./db')
const storage = require('./storage')

const savePosterOnDisk = (season, id, url) => new Promise((resolve, reject) => {
  const dummy = './data/dummy.jpg'
  const filename = `./data/${season}/${id}.jpg`

  if (!url) return resolve(dummy)
  if (fs.existsSync(filename)) return resolve(filename)

  const saveFile = ({ body }) => {
    const file = fs.createWriteStream(filename)

    body.pipe(file)
    file.on('finish', () => {
      file.close(() => {
        im.resize({ srcPath: filename, dstPath: filename, width: 640, quality: 0.5 }, (err) => {
          if (err) reject(err)

          resolve(filename)
        })
      })
    })
  }

  console.log('> Downloading...', season, id, url)

  fetch(url).then(saveFile)
})

const parseSeasonPage = (season) => new Promise((resolve) => {
  const url = `http://advetime.ru/category/sezon-${season}`
  const linkSelector = '.type_category .cell-content .wrap h4 a'

  return request(url).then(body => {
    const $ = cheerio.load(body)
    const links = $(linkSelector)

    const episodes = links.map((_, link) => ({
      title: $(link).text(),
      url: $(link).attr('href')
    })).get().map(({ title, url }) => {
      const [, id, name] = title.match(/(.+?)\s*-\s*(.+)/)

      return { id, name, season, url }
    })

    resolve(episodes)
  })
})

const parseEpisodePage = ({ id, name, season, url }) => new Promise((resolve) => {
  const tabsSelector = '.type_page_content .tabs_widget'
  const voiceTitleSelector = '.elem span'
  const posterSelector = '.page_content p img'

  return request(url).then(body => {
    const $ = cheerio.load(body)

    const posterUrl = $(posterSelector).attr('src')
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
      url: links[i] || ''
    }))

    savePosterOnDisk(season, id, posterUrl).then(filename => {
      storage.upload(filename, `seasons/${season}/${id}.jpg`).then(poster =>
        resolve({ id, name, url, poster, videos })
      )
    })
  })
})

const parseFullSeason = (season) => new Promise((resolve) => {
  parseSeasonPage(season).then(episodes => {
    Promise.all(episodes.map(parseEpisodePage)).then(episodesList => {
      resolve(episodesList)
      setSeasonData(season, episodesList)
    })
  })
})

module.exports = { parseFullSeason }

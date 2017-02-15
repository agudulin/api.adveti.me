const firebase = require('firebase')

const config = require('./.firebase.conf.json')

try {
  firebase.initializeApp(config)
} catch (err) {
  console.error('Firebase initialization error', err.stack)
}

const root = firebase
  .database()
  .ref('v0')

const getSeasonData = (id) => new Promise((resolve) => {
  root.child('seasons')
    .child(id)
    .once('value')
    .then(episodes => resolve(episodes.val()))
})

const setSeasonData = (season, data) => (
  root.child('seasons')
    .child(season)
    .set(data)
)

module.exports = { db: root, getSeasonData, setSeasonData }

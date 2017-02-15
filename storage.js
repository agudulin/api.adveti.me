const gcloud = require('@google-cloud/storage')

const storageBucket = 'advetime-b57e7.appspot.com'
const storage = gcloud({
  projectId: 'advetime-b57e7',
  keyFilename: './.gcloud.conf.json'
})
const bucket = storage.bucket(storageBucket)

const upload = (filename, destination) => new Promise((resolve, reject) => {
  bucket.upload(filename, { destination }, (err, file) => {
    if (err) return reject(err)
    const encodedPath = encodeURIComponent(file.metadata.name)

    resolve(`https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media`)
  })
})

module.exports = { upload }

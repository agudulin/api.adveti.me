const api = require('./api')
const micro = require('micro')
const cors = require('micro-cors')()

const port = 3001

const app = micro(cors(api))

app.listen(port)

console.info(`listening on port ${port}...`)

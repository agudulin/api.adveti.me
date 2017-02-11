const micro = require('micro')
const cors = require('micro-cors')()
const visualize = require('micro-visualize')
const api = require('./api')

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

const port = 3001

const app = compose(micro, visualize, cors)(api)

app.listen(port)

console.info(`listening on port ${port}...`)

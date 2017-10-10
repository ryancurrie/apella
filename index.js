const express = require('express')
const { MongoClient } = require('mongdb')
const app = express()

const publicPath = path.join(__dirname, 'public')
const staticMiddleware = express.static(publicPath)

app.use(staticMiddleware)

app.listen(3000, () => {
  console.log('Listening on port 3000!')
})

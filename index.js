const express = require('express')
const path = require('path')
const { MongoClient } = require('mongodb')
const superagent = require('superagent')
const jsonParser = require('body-parser').json()

const googleCivicKey = 'AIzaSyBql7aJLrYqP0dOY1nfo7kFoGjKsnQ4TVY'
const app = express()

const publicPath = path.join(__dirname, 'public')
const staticMiddleware = express.static(publicPath)

app.use(staticMiddleware)

app.get('/get-reps/:zip', ({params: { zip }}, res) => {
  superagent.get('https://www.googleapis.com/civicinfo/v2/representatives')
  .query({ key: googleCivicKey, address: zip, roles: ['legislatorupperbody', 'legislatorlowerbody']})
  .end((err, result) => {
    if (err) {return console.log(err)}
    res.json(result.body)
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000!')
})

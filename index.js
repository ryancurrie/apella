const express = require('express')
const path = require('path')
const { MongoClient } = require('mongodb')
const superagent = require('superagent')
const jsonParser = require('body-parser').json()
const { updatePhone } = require('./phone.js')

MongoClient.connect('mongodb://localhost/apella', (err, db) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  const representatives = db.collection('representatives')

  const googleCivicKey = 'AIzaSyBql7aJLrYqP0dOY1nfo7kFoGjKsnQ4TVY'
  const app = express()

  const publicPath = path.join(__dirname, 'public')
  const staticMiddleware = express.static(publicPath)

  app.use(staticMiddleware)

  app.get('/get-reps/:zip', ({ params: { zip } }, res) => {
    superagent
      .get('https://www.googleapis.com/civicinfo/v2/representatives')
      .query({
        key: googleCivicKey,
        address: zip,
        roles: ['legislatorupperbody', 'legislatorlowerbody']
      })
      .then((result, errA) => {
        if (err) {
          console.log(errA)
          res.sendStatus(500)
          process.exit(1)
        }
        return result.body.officials
      })
      .then((reps, errB) => {
        if (errB) {
          console.log(errB)
          res.sendStatus(500)
          process.exit(1)
        }

        updatePhone(reps).then(updated => {
          Promise.all(
            updated.reduce((promises, record) => {
              return [
                ...promises,
                new Promise((resolve, reject) => {
                  representatives
                    .findOneAndUpdate(
                      {
                        phone: record.phones.join('')
                      },
                      { $set: { photoUrl: record.photoUrl } },
                      { returnOriginal: false }
                    )
                    .then((results, errC) => {
                      if (errC) {
                        console.log(errC)
                        res.sendStatus(500)
                        process.exit(1)
                      } else {
                        resolve(results)
                      }
                    })
                })
              ]
            }, [])
          ).then((json, errD) => {
            if (errD) {
              console.log(errD)
              res.sendStatus(500)
              process.exit(1)
            } else {
              res.send(json)
              res.sendStatus(200)
            }
          })
        })
      })
  })
  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
})

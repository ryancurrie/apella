const express = require('express')
require('dotenv').config()
const path = require('path')
const { MongoClient } = require('mongodb')
const superagent = require('superagent')
const jsonParser = require('body-parser').json()
const { updatePhone } = require('./phone.js')

MongoClient.connect('mongodb://localhost/apella', (err, db) => {
  if (err) {
    process.exit(1)
  }
  const representatives = db.collection('representatives')

  const app = express()

  const publicPath = path.join(__dirname, 'public')
  const staticMiddleware = express.static(publicPath)

  app.use(staticMiddleware)

  app.get('/get-reps/:zip', ({ params: { zip } }, res) => {
    superagent
      .get('https://www.googleapis.com/civicinfo/v2/representatives')
      .query({
        key: process.env.GC_Key,
        address: zip,
        roles: ['legislatorupperbody', 'legislatorlowerbody']
      })
      .then((result, err) => {
        if (err) {
          return res.sendStatus(500)
        }
        return result.body.officials
      })
      .then(reps => {
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
                    .then((results, err) => {
                      if (err) {
                        return res.sendStatus(500)
                      } else {
                        resolve(results)
                      }
                    })
                })
              ]
            }, [])
          ).then((json, err) => {
            if (err) {
              return res.sendStatus(500)
            } else {
              return res.status(200).send(json)
            }
          })
        })
      })
  })

  app.get('/bills-by-rep/:id', ({ params: { id } }, res) => {
    superagent
      .get(
        `https://api.propublica.org/congress/v1/members/${id}/bills/introduced.json`
      )
      .set('x-api-key', propublicaKey)
      .then((resp, err) => {
        if (err) {
          console.log(err)
          return res.sendStatus(500)
        } else {
          res.status(200).send(resp.body.results)
        }
      })
  })
  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
})

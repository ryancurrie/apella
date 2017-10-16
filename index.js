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

  app.get('/bills-by-rep/:repId', ({ params: { repId } }, res) => {
    superagent
      .get(
        `https://api.propublica.org/congress/v1/members/${repId}/bills/introduced.json`
      )
      .set('x-api-key', process.env.PP_Key)
      .then((resp, err) => {
        if (err) {
          return res.sendStatus(500)
        } else {
          res.status(200).send(resp.body.results[0].bills)
        }
      })
  })

  app.get('/get-rep-by-id/:repId', ({ params: repId }, res) => {
    representatives.findOne({ id: repId.repId }, (err, resp) => {
      if (err) {
        return res.sendStatus(500)
      } else {
        res.status(200).json(resp)
      }
    })
  })

  app.get('/bills/:chamber/latest', ({ params: { chamber } }, res) => {
    superagent
      .get(
        `https://api.propublica.org/congress/v1/115/${chamber}/bills/introduced.json`
      )
      .set('x-api-key', process.env.PP_Key)
      .then((resp, err) => {
        if (err) {
          return res.sendStatus(500)
        } else {
          res.status(200).send(resp.body.results[0].bills)
        }
      })
  })

  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
})

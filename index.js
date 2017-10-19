const express = require('express')
require('dotenv').config()
const path = require('path')
const { MongoClient } = require('mongodb')
const superagent = require('superagent')
const jsonParser = require('body-parser').json()
const { updatePhone } = require('./phone.js')
const cheerio = require('cheerio')

MongoClient.connect('mongodb://localhost/apella', (err, db) => {
  if (err) {
    process.exit(1)
  }
  const representatives = db.collection('representatives')

  const app = express()
  app.set('view engine', 'pug')

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

  app.get('/rep/:repId/bills', ({ params: { repId } }, res) => {
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

  app.get('/rep/:repId', ({ params: { repId } }, res) => {
    representatives.findOne({ id: repId }, (err, resp) => {
      if (err) {
        return res.sendStatus(500)
      } else {
        if (resp.photoUrl) {
          res.status(200).json(resp)
        } else {
          const $photo = Object.assign(resp, {
            photoUrl: `https://theunitedstates.io/images/congress/225x275/${repId}.jpg`
          })
          res.status(200).json($photo)
        }
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

  app.get('/bills/:billId', ({ params: { billId } }, res) => {
    superagent
      .get(`https://api.propublica.org/congress/v1/115/bills/${billId}.json`)
      .set('x-api-key', process.env.PP_Key)
      .then((resp, err) => {
        if (err) {
          console.log(err)
          return res.sendStatus(500)
        } else {
          return {
            url: resp.body.results[0].congressdotgov_url,
            repId: resp.body.results[0].sponsor_id,
            summary: resp.body.results[0].summary,
            title: resp.body.results[0].title,
            house_passage: resp.body.results[0].house_passage,
            senate_passage: resp.body.results[0].senate_passage,
            enacted: resp.body.results[0].enacted,
            active: resp.body.results[0].active,
            primary_subject: resp.body.results[0].primary_subject,
            introduced_date: resp.body.results[0].introduced_date
          }
        }
      })
      .then(
        (
          {
            url,
            repId,
            summary,
            title,
            house_passage,
            senate_passage,
            enacted,
            active,
            primary_subject,
            introduced_date
          },
          err
        ) => {
          if (err) {
            console.log(err)
            return res.sendStatus(500)
          } else {
            superagent.get(url + '/text').then((page, err) => {
              if (err) {
                console.log(err)
                return res.sendStatus(500)
              } else {
                const $ = cheerio.load(page.text)
                res.send({
                  content: $.html('.generated-html-container'),
                  repId,
                  summary,
                  title,
                  house_passage,
                  senate_passage,
                  enacted,
                  active,
                  primary_subject,
                  introduced_date
                })
              }
            })
          }
        }
      )
  })

  app.get('/rep/campaign/:repId', ({ params: { repId } }, res) => {
    representatives
      .findOne({ id: repId })
      .then(doc => {
        return doc.crp_id
      })
      .then((crpId, err) => {
        if (err) {
          return res.sendStatus(500)
        } else {
          superagent
            .get(
              `http://www.opensecrets.org/api/?method=candContrib&cid=${crpId}&output=json&apikey=${process
                .env.OS_Key}`
            )
            .accept('json')
            .then((resp, err) => {
              if (err) {
                return res.sendStatus(500)
              } else {
                const $parsed = JSON.parse(resp.text)
                const $contributors = $parsed.response.contributors.contributor
                res.send($contributors)
              }
            })
        }
      })
  })

  app.get('/bill/:billId', ({ params: { billId } }, res) => {
    res.render('bill', { billId: billId })
  })

  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
})

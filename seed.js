require('dotenv').config()

let dbUrl

if (process.env.ENVIRONMENT === 'production') {
  dbUrl = process.env.DB_Prod
} else {
  dbUrl = process.env.DB_Dev
}

const { MongoClient } = require('mongodb')
const fs = require('fs')

const addChamber = function(list, chamber) {
  return list.map(item => ({ ...item, chamber }))
}

MongoClient.connect(dbUrl, (err, db) => {
  if (err) {
    console.log(dbUrl)
    console.log(err)
    process.exit(1)
  }
  const representatives = db.collection('representatives')
  representatives.findOne({}).then(results => {
    if (results) {
      console.log('Good to go!')
      db.close()
    } else {
      representatives
        .deleteMany({})
        .then(() => JSON.parse(fs.readFileSync('senate.json')))
        .then(parsed => addChamber(parsed, 'Senate'))
        .then(input => representatives.insertMany(input))
        .then(() => JSON.parse(fs.readFileSync('house.json')))
        .then(parsed => addChamber(parsed, 'House'))
        .then(input => representatives.insertMany(input))
        .catch(err => {
          console.log(err)
          process.exit(1)
        })
        .then(() => console.log('Representatives added!'))
        .then(() => db.close())
    }
  })
})

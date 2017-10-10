const { MongoClient } = require('mongodb')
const fs = require('fs')

const addChamber = function (list, chamber) {
    return list.map(item => ({...item, chamber}))
}

MongoClient.connect('mongodb://localhost/apella', (err, db) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  const representatives = db.collection('representatives')
  representatives
    .deleteMany({})
    .then(() => JSON.parse(fs.readFileSync('senate.json')))
    .then(parsed => addChamber(parsed, 'senate'))
    .then(input => representatives.insertMany(input))
    .then(() => JSON.parse(fs.readFileSync('house.json')))
    .then(parsed => addChamber(parsed, 'house'))
    .then(input => representatives.insertMany(input))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
  .then(() => console.log('Representatives added!'))
  .then(() => db.close())
})

function formatPhone(phone) {
  return phone.replace(/\(|\)/g, '').replace(' ', '-')
}

function updatePhone(collection) {
  return new Promise((resolve, reject) => {
    resolve(
      collection.map(senator => {
        return Object.assign({}, senator, {
          phones: [formatPhone(senator.phones[0])]
        })
      })
    )

    resolve(newCollection)
  })
}

module.exports = { updatePhone }

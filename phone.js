function formatPhone(phone) {
  return phone.replace(/\(|\)/g, '').replace(' ', '-')
}

function updatePhone(collection) {
  return new Promise((resolve, reject) => {
    const newCollection = []
    for (let i = 0; i < collection.length; i++) {
      const relevantPhones = collection[i].phones
      const newPhone =
        relevantPhones.length > 0 ? formatPhone(relevantPhones[0]) : false
      const newPhoneArray = newPhone ? [newPhone] : []
      newCollection.push(
        Object.assign(collection[i], { phones: newPhoneArray })
      )
    }
    resolve(newCollection)
  })
}

module.exports = { updatePhone }

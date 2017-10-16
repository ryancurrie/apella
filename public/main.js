const $headerMsg = document.querySelector('#header-msg')
const $apella = document.querySelector('#apella')
const $findRep = document.querySelector('#find-rep')
const $latestSenate = document.querySelector('#senate-latest')
const $latestHouse = document.querySelector('#house-latest')

const renderSearch = () => {
  const $form = document.createElement('div')
  $form.classList.add('col', 's12', 'l6', 'offset-l3', 'center')

  const $headlineRow = document.createElement('div')
  $headlineRow.classList.add('row')

  const $headline = document.createElement('h1')
  $headline.classList.add('flow-text', 'primary-text-color')
  $headline.textContent = 'Find your representatives'

  const $zipRow = document.createElement('div')
  $zipRow.classList.add('row', 'input-field')
  $zipRow.setAttribute('id', 'zip-search-fields')

  const $icon = document.createElement('i')
  $icon.classList.add('material-icons', 'prefix')
  $icon.textContent = 'add_location'

  const $zip = document.createElement('input')
  $zip.setAttribute('id', 'zip-code')
  $zip.classList.add('input')
  $zip.setAttribute('type', 'text')

  const $zipLable = document.createElement('label')
  $zipLable.setAttribute('for', 'zip-code')
  $zipLable.textContent = 'ZIP code'

  const $buttonRow = document.createElement('row')
  $buttonRow.classList.add('row')

  const $button = document.createElement('a')
  $button.classList.add('waves-effect', 'waves-light', 'btn-large')
  $button.setAttribute('id', 'zip-search-button')
  $button.textContent = 'Search'

  $form.appendChild($headlineRow)
  $headlineRow.appendChild($headline)
  $form.appendChild($zipRow)
  $zipRow.appendChild($icon)
  $zipRow.appendChild($zip)
  $zipRow.append($zipLable)
  $form.appendChild($buttonRow)
  $buttonRow.appendChild($button)

  return $form
}

const renderLatestSenate = collection => {
  const $latestSenateBills = document.createElement('div')
  $latestSenateBills.classList.add('row')

  const $listWrapper = document.createElement('div')
  $listWrapper.classList.add('collection', 'col', 's12')

  $latestSenateBills.appendChild($listWrapper)

  for (let prop in collection) {
    const $bill = document.createElement('a')
    $bill.classList.add('collection-item', 'bill-listing')
    $bill.setAttribute('href', collection[prop].bill_id)
    $bill.textContent = collection[prop].title

    $listWrapper.appendChild($bill)
  }

  return $latestSenateBills
}

const renderReps = ({
  value: {
    chamber,
    id,
    first_name,
    last_name,
    party,
    photoUrl,
    short_title,
    contact_form,
    phone,
    office
  }
}) => {
  const $repCard = document.createElement('div')
  $repCard.classList.add('row')

  const $card = document.createElement('div')
  $card.classList.add('card', 'horizontal', 'col', 'l6', 's12', 'offset-l3')

  const $imgDiv = document.createElement('div')
  $imgDiv.classList.add('card-image', 'rep-photo')

  const $img = document.createElement('img')
  $img.setAttribute('src', photoUrl)

  const $cardDiv = document.createElement('div')
  $cardDiv.classList.add('card-stacked')

  const $contentDiv = document.createElement('div')
  $contentDiv.classList.add('card-content')

  const $chamber = document.createElement('p')
  $chamber.textContent = chamber

  const $repName = document.createElement('p')
  $repName.textContent = `${short_title} ${first_name} ${last_name} (${party})`

  const $office = document.createElement('p')
  $office.textContent = `${office}`

  const $phonePara = document.createElement('p')

  const $phone = document.createElement('a')
  $phone.textContent = `${phone}`
  $phone.setAttribute('href', `tel:${phone}`)

  const $contactPara = document.createElement('p')

  const $contact = document.createElement('a')
  $contact.textContent = 'Email'
  $contact.setAttribute('href', `${contact_form}`)

  const $actionDiv = document.createElement('div')
  $actionDiv.classList.add('card-action')

  const $cardAction = document.createElement('a')
  $cardAction.setAttribute('href', '#')
  $cardAction.setAttribute('class', 'see-bill')
  $cardAction.setAttribute('data-id', `${id}`)
  $cardAction.textContent = 'See Bills'
  $cardAction.addEventListener('click', event => {
    event.preventDefault()
    if (event.target.tagName.toLowerCase() === 'a') {
      const $id = event.target.dataset.id

      showRepBills($apella, $id)

      $headerMsg.textContent = 'Bills By Your Representative'
    }
  })

  $repCard.appendChild($card)
  $card.appendChild($imgDiv)
  $imgDiv.appendChild($img)
  $card.appendChild($cardDiv)
  $cardDiv.appendChild($contentDiv)
  $contentDiv.appendChild($chamber)
  $contentDiv.appendChild($repName)
  $contentDiv.appendChild($office)
  $contentDiv.appendChild($phonePara)
  $phonePara.appendChild($phone)
  $contentDiv.appendChild($contactPara)
  $contactPara.appendChild($contact)
  $cardDiv.appendChild($actionDiv)
  $actionDiv.appendChild($cardAction)

  return $repCard
}

const renderRep = ({
  chamber,
  id,
  first_name,
  last_name,
  party,
  photoUrl,
  short_title,
  contact_form,
  phone,
  office
}) => {
  const $repCard = document.createElement('div')
  $repCard.classList.add('row')

  const $card = document.createElement('div')
  $card.classList.add('card', 'horizontal', 'col', 'l6', 's12', 'offset-l3')

  const $imgDiv = document.createElement('div')
  $imgDiv.classList.add('card-image', 'rep-photo')

  const $img = document.createElement('img')
  $img.setAttribute('src', photoUrl)

  const $cardDiv = document.createElement('div')
  $cardDiv.classList.add('card-stacked')

  const $contentDiv = document.createElement('div')
  $contentDiv.classList.add('card-content')

  const $chamber = document.createElement('p')
  $chamber.textContent = chamber

  const $repName = document.createElement('p')
  $repName.textContent = `${short_title} ${first_name} ${last_name} (${party})`

  const $office = document.createElement('p')
  $office.textContent = `${office}`

  const $phonePara = document.createElement('p')

  const $phone = document.createElement('a')
  $phone.textContent = `${phone}`
  $phone.setAttribute('href', `tel:${phone}`)

  const $contactPara = document.createElement('p')

  const $contact = document.createElement('a')
  $contact.textContent = 'Email'
  $contact.setAttribute('href', `${contact_form}`)

  $repCard.appendChild($card)
  $card.appendChild($imgDiv)
  $imgDiv.appendChild($img)
  $card.appendChild($cardDiv)
  $cardDiv.appendChild($contentDiv)
  $contentDiv.appendChild($chamber)
  $contentDiv.appendChild($repName)
  $contentDiv.appendChild($office)
  $contentDiv.appendChild($phonePara)
  $phonePara.appendChild($phone)
  $contentDiv.appendChild($contactPara)
  $contactPara.appendChild($contact)

  return $repCard
}

/*For showing bills by member*/

const renderRepBills = collection => {
  const $billsByRep = document.createElement('div')
  $billsByRep.classList.add('row')

  const $listWrapper = document.createElement('div')
  $listWrapper.classList.add('collection', 'col', 'l6', 's12', 'offset-l3')
  $listWrapper.setAttribute('id', 'bills-list-rep')

  $billsByRep.appendChild($listWrapper)

  for (let prop in collection) {
    const $bill = document.createElement('a')
    $bill.classList.add('collection-item', 'bill-listing')
    $bill.setAttribute('href', collection[prop].bill_id)
    $bill.textContent = collection[prop].title

    $listWrapper.appendChild($bill)
  }

  return $billsByRep
}

/*Fetch Functions*/

const getReps = query => {
  const url = `/get-reps/${query}`
  return fetch(url).then(results => results.json())
}

const getLatestSenate = () => {
  return fetch('/latest-bills-senate').then(results => results.json())
}

const getLatestHouse = () => {
  return fetch('/latest-bills-house').then(results => results.json())
}

const getRepBills = id => {
  const url = `/bills-by-rep/${id}`
  return fetch(url).then(results => results.json())
}

const getRepById = id => {
  const url = `/get-rep-by-id/${id}`
  return fetch(url).then(results => results.json())
}

/*Show Functions */

const showReps = (location, query) => {
  getReps(query).then(reps => {
    location.innerHTML = ''

    reps
      .map(rep => renderReps(rep))
      .forEach($repCard => location.appendChild($repCard))
  })
}

const showRepBills = (location, query) => {
  getRepById(query).then(rep => {
    location.innerHTML = ''
    location.appendChild(renderRep(rep))
  })

  getRepBills(query).then(bills => {
    location.appendChild(renderRepBills(bills))
  })
}

const showSenateLatest = location => {
  getLatestSenate().then(latest => {
    location.appendChild(renderLatestSenate(latest))
  })
}

/*Initiates page*/

$findRep.appendChild(renderSearch())
$latestSenate.appendChild(showSenateLatest($latestSenate))

/* Event listeners*/
const $searchButton = document.querySelector('#zip-search-button')

$searchButton.addEventListener('click', event => {
  event.preventDefault()
  const $entry = document.querySelector('#zip-code').value

  if ($entry.length !== 5) {
    Materialize.toast('Please enter a valid ZIP code', 4000)
  } else {
    showReps($apella, $entry)
    $headerMsg.textContent = 'Your Representatives'
  }
})

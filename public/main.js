const $headerMsg = document.querySelector('#header-msg')
const $apella = document.querySelector('#apella')

/*Fetch Functions*/

const getReps = query => {
  const url = `/get-reps/${query}`
  return fetch(url).then(results => results.json())
}

const getLatestBills = chamber => {
  return fetch(`/bills/${chamber}/latest`).then(results => results.json())
}

const getBill = billId => {
  return fetch(`/bills/${billId}`).then(results => results.json())
}

const getRepById = id => {
  const url = `/rep/${id}`
  return fetch(url).then(results => results.json())
}

const getRepBills = id => {
  const url = `/rep/${id}/bills`
  return fetch(url).then(results => results.json())
}

const getRepCampaign = id => {
  const url = `/rep/campaign/${id}`
  return fetch(url).then(results => results.json())
}

/* Render Functions */

const renderHome = () => {
  const $home = document.createElement('div')

  const $findRep = document.createElement('div')
  $findRep.classList.add('row')
  $findRep.setAttribute('id', 'find-rep')

  const $latestBills = document.createElement('div')
  $latestBills.classList.add('row')
  $latestBills.setAttribute('id', 'latest-bills')

  const $latestSenate = document.createElement('div')
  $latestSenate.classList.add('col', 's12', 'l6')
  $latestSenate.setAttribute('id', 'latest-senate')

  const $senateHeader = document.createElement('h2')
  $senateHeader.classList.add('center', 'flow-text')
  $senateHeader.textContent = 'Recently Introduced Senate Bills'

  const $latestHouse = document.createElement('div')
  $latestHouse.classList.add('col', 's12', 'l6')
  $latestHouse.setAttribute('id', 'latest-house')

  const $houseHeader = document.createElement('h2')
  $houseHeader.classList.add('center', 'flow-text')
  $houseHeader.textContent = 'Recently Introduced House Bills'

  $home.appendChild($findRep)
  $home.appendChild($latestBills)
  $latestBills.appendChild($latestSenate)
  $latestBills.appendChild($latestHouse)
  $latestSenate.appendChild($senateHeader)
  $latestHouse.appendChild($houseHeader)

  return $home
}

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

const renderLatestBills = collection => {
  const $latestBills = document.createElement('div')
  $latestBills.classList.add('row')

  const $listWrapper = document.createElement('ul')
  $listWrapper.classList.add('collection', 'col', 's12')

  $latestBills.appendChild($listWrapper)

  for (let prop in collection) {
    const $bill = document.createElement('li')
    $bill.classList.add('collection-item', 'bill-listing')

    const $billWrapper = document.createElement('div')

    const $title = document.createElement('a')
    $title.textContent = collection[prop].title
    $title.setAttribute('href', '/bill/' + collection[prop].bill_slug)
    $title.textContent = collection[prop].title

    const $details = document.createElement('div')
    $details.classList.add('listing-details')

    const $date = document.createElement('p')
    $date.textContent = collection[prop].introduced_date

    const $sponsor = document.createElement('p')
    $sponsor.textContent =
      collection[prop].sponsor_name +
      ' (' +
      collection[prop].sponsor_party +
      ')'

    $bill.appendChild($billWrapper)
    $billWrapper.appendChild($title)
    $billWrapper.appendChild($details)
    $details.appendChild($sponsor)
    $details.appendChild($date)

    $listWrapper.appendChild($bill)
  }
  return $latestBills
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
    state,
    office,
    facebook_account,
    twitter_account
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
  $repName.textContent = `${short_title} ${first_name} ${last_name} (${party}) - ${state}`

  const $office = document.createElement('p')
  $office.textContent = `${office}`

  const $phonePara = document.createElement('p')

  const $phone = document.createElement('a')
  $phone.textContent = `${phone}`
  $phone.setAttribute('href', `tel:${phone}`)

  const $contactPara = document.createElement('p')

  const $contact = document.createElement('a')
  $contact.textContent = 'Email'
  if (contact_form) {
    $contact.setAttribute('href', `${contact_form}`)
  } else {
    $contact.setAttribute('href', '#')
    $contact.setAttribute(
      'onclick',
      "Materialize.toast('Sorry, no contact information for this representative', 4000, 'accent-color')"
    )
  }

  const $socialPara = document.createElement('p')

  const $fbLink = document.createElement('a')
  $fbLink.setAttribute('href', `https://facebook.com/${facebook_account}`)

  const $fbIcon = document.createElement('i')
  $fbIcon.classList.add('icon', 'ion-social-facebook')

  const $twLink = document.createElement('a')
  $twLink.setAttribute('href', `https://twitter.com/${twitter_account}`)

  const $twIcon = document.createElement('i')
  $twIcon.classList.add('icon', 'ion-social-twitter')

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

  if (facebook_account || twitter_account) {
    $contentDiv.appendChild($socialPara)
  }

  if (facebook_account) {
    $socialPara.appendChild($fbLink)
    $fbLink.appendChild($fbIcon)
  }

  if (twitter_account) {
    $socialPara.appendChild($twLink)
    $twLink.appendChild($twIcon)
  }

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
  state,
  phone,
  office,
  twitter_account,
  facebook_account
}) => {
  const $repCard = document.createElement('div')
  $repCard.classList.add('row')
  $repCard.setAttribute('id', 'rep-card')

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
  $repName.textContent = `${short_title} ${first_name} ${last_name} (${party}) - ${state}`

  const $office = document.createElement('p')
  $office.textContent = `${office}`

  const $phonePara = document.createElement('p')

  const $phone = document.createElement('a')
  $phone.textContent = `${phone}`
  $phone.setAttribute('href', `tel:${phone}`)

  const $contactPara = document.createElement('p')

  const $contact = document.createElement('a')
  $contact.textContent = 'Email'
  if (contact_form) {
    $contact.setAttribute('href', `${contact_form}`)
  } else {
    $contact.setAttribute('href', '#')
    $contact.setAttribute(
      'onclick',
      "Materialize.toast('Sorry, no contact information for this representative', 4000, 'accent-color')"
    )
  }

  const $socialPara = document.createElement('p')

  const $fbLink = document.createElement('a')
  $fbLink.setAttribute('href', `https://facebook.com/${facebook_account}`)

  const $fbIcon = document.createElement('i')
  $fbIcon.classList.add('icon', 'ion-social-facebook')

  const $twLink = document.createElement('a')
  $twLink.setAttribute('href', `https://twitter.com/${twitter_account}`)

  const $twIcon = document.createElement('i')
  $twIcon.classList.add('icon', 'ion-social-twitter')

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
  if (facebook_account || twitter_account) {
    $contentDiv.appendChild($socialPara)
  }

  if (facebook_account) {
    $socialPara.appendChild($fbLink)
    $fbLink.appendChild($fbIcon)
  }

  if (twitter_account) {
    $socialPara.appendChild($twLink)
    $twLink.appendChild($twIcon)
  }

  return $repCard
}

const renderRepBills = collection => {
  const $billsByRep = document.createElement('div')
  $billsByRep.classList.add('row')

  const $listWrapper = document.createElement('div')
  $listWrapper.classList.add('collection', 'col', 'l6', 's12', 'offset-l3')
  $listWrapper.setAttribute('id', 'bills-list-rep')

  $billsByRep.appendChild($listWrapper)

  for (let prop in collection) {
    const $replace = collection[prop].bill_id
    const $bill_slug = $replace.replace(/-115/, '')
    const $bill = document.createElement('a')
    $bill.classList.add('collection-item', 'bill-listing')
    $bill.setAttribute('href', `bill/${$bill_slug}`)
    $bill.textContent = collection[prop].title

    $listWrapper.appendChild($bill)
  }

  return $billsByRep
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

const showLatestBills = (location, chamber) => {
  getLatestBills(chamber).then(latest => {
    location.appendChild(renderLatestBills(latest))
  })
}

/*Initiates page*/

$apella.appendChild(renderHome())

const $findRep = document.querySelector('#find-rep')
const $latestSenate = document.querySelector('#latest-senate')
const $latestHouse = document.querySelector('#latest-house')

$findRep.appendChild(renderSearch())
showLatestBills($latestSenate, 'senate')
showLatestBills($latestHouse, 'house')

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

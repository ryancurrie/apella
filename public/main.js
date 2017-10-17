const $headerMsg = document.querySelector('#header-msg')
const $apella = document.querySelector('#apella')
const $findRep = document.querySelector('#find-rep')
const $latestSenate = document.querySelector('#senate-latest')
const $latestHouse = document.querySelector('#house-latest')

/*Currency Fromatter */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

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
    $title.setAttribute('href', '#')
    $title.setAttribute('data-billId', collection[prop].bill_slug)
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

const renderBill = collection => {}

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
    const $replace = collection[prop].bill_id
    const $bill_slug = $replace.replace(/-115/, '')
    const $bill = document.createElement('a')
    $bill.classList.add('collection-item', 'bill-listing')
    $bill.setAttribute('data-billid', $bill_slug)
    $bill.setAttribute('href', '#')
    $bill.textContent = collection[prop].title
    $bill.addEventListener('click', event => {
      event.preventDefault()
      if (event.target.tagName.toLowerCase() === 'a') {
        const $id = event.target.dataset.billid

        showBill($apella, $id)

        $headerMsg.textContent = ''
      }
    })

    $listWrapper.appendChild($bill)
  }

  return $billsByRep
}

/* For showing member campaign details */

const renderCampaignDetails = contributors => {
  const $topContributors = document.createElement('div')
  $topContributors.classList.add('row')
  $topContributors.setAttribute('id', 'top-contributors')

  const $listWrapper = document.createElement('div')
  $listWrapper.classList.add('col', 's12', 'l6', 'offset-l3')

  const $header = document.createElement('h2')
  $header.classList.add('center', 'flow-text')
  $header.textContent = 'Top Campaign Contributors'

  const $list = document.createElement('ul')
  $list.classList.add('collection')

  $topContributors.appendChild($listWrapper)
  $listWrapper.appendChild($header)
  $listWrapper.appendChild($list)

  contributors.forEach(contributor => {
    const $contributor = document.createElement('li')
    $contributor.classList.add('collection-item')
    $contributor.textContent = contributor['@attributes'].org_name

    const $contribution = document.createElement('span')
    $contribution.classList.add('right')
    $contribution.textContent = formatter.format(
      contributor['@attributes'].total
    )

    $contributor.appendChild($contribution)
    $list.appendChild($contributor)
  })

  return $topContributors
}

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

/*Show Functions */

const showReps = (location, query) => {
  getReps(query).then(reps => {
    location.innerHTML = ''

    reps
      .map(rep => renderReps(rep))
      .forEach($repCard => location.appendChild($repCard))
  })
}

const showBill = (location, query) => {
  getBill(query).then(({ content, repId }) => {
    const $bill = document.createElement('div')
    $bill.innerHTML = content

    location.innerHTML = ''
    location.appendChild($bill)
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

$findRep.appendChild(renderSearch())
showLatestBills($latestSenate, 'senate')
showLatestBills($latestHouse, 'house')

/*$latestHouse.appendChild(showLatestBills($latestHouse, 'house'))*/

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

const $headerMsg = document.querySelector('#header-msg')
const $apella = document.querySelector('#apella')
const $genius = document.querySelector('#genius')

/*Currency Fromatter */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

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
  $latestBills.addEventListener('click', event => {
    event.preventDefault()
    if (event.target.tagName.toLowerCase() === 'a') {
      const $billId = event.target.dataset.billid
      const $repId = event.target.dataset.repid

      history.pushState(null, null, $billId)

      document
        .querySelector('link[rel="canonical"]')
        .setAttribute('href', location.href)

      const $geniusScript = document.createElement('script')
      $geniusScript.setAttribute('async', '')
      $geniusScript.setAttribute('src', '//genius.codes')
      $genius.append($geniusScript)

      showBill($apella, $billId, $repId)

      $headerMsg.textContent = 'Bill ' + $billId.toUpperCase()
    }
  })

  for (let prop in collection) {
    const $bill = document.createElement('li')
    $bill.classList.add('collection-item', 'bill-listing')

    const $billWrapper = document.createElement('div')

    const $title = document.createElement('a')
    $title.textContent = collection[prop].title
    $title.setAttribute('href', '#')
    $title.setAttribute('data-billid', collection[prop].bill_slug)
    $title.setAttribute('data-repid', collection[prop].sponsor_id)
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
  state,
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
  }

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

const renderRepBillView = ({
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
  office
}) => {
  const $repCard = document.createElement('div')
  $repCard.classList.add('row')

  const $header = document.createElement('h2')
  $header.textContent = 'Bill Sponsor'
  $header.classList.add('center', 'flow-text')

  const $card = document.createElement('div')
  $card.classList.add('card', 'horizontal')

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
  }

  $repCard.appendChild($header)
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
    $bill.setAttribute('data-repid', collection[prop].sponsor_id)
    $bill.setAttribute('href', `#${$bill_slug}`)
    $bill.textContent = collection[prop].title
    $bill.addEventListener('click', event => {
      event.preventDefault()
      if (event.target.tagName.toLowerCase() === 'a') {
        const $billId = event.target.dataset.billid
        const $repId = event.target.dataset.repid

        showBill($apella, $billId, $repId)

        $headerMsg.textContent = 'Bill ' + $billId.toUpperCase()
      }
    })

    $listWrapper.appendChild($bill)
  }

  return $billsByRep
}

const renderCampaignDetails = contributors => {
  const $topContributors = document.createElement('div')
  $topContributors.classList.add('row')
  $topContributors.setAttribute('id', 'top-contributors')

  const $listWrapper = document.createElement('div')

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

const renderBill = ({ content, repId, summary, title }) => {
  const $bill = document.createElement('div')
  if (content.length > 0) {
    $bill.innerHTML = content
  } else if (summary.length > 0) {
    $bill.innerHTML = `<h5 id="no-content-header" class="flow-text center">${title}</h5><p class="summary">${summary}</p>`
  } else {
    $bill.innerHTML = `<h5 id="no-content-header" class="flow-text center">${title}</h5><p>No text is available for this bill.</p>`
  }

  return $bill
}

const renderCheck = () => {
  const $check = document.createElement('i')
  $check.textContent = 'check_circle'
  $check.classList.add('tiny', 'material-icons', 'green-text', 'accent-3')
  return $check
}

const renderClose = () => {
  const $close = document.createElement('i')
  $close.textContent = 'close'
  $close.classList.add('tiny', 'material-icons', 'red-text')
  return $close
}

const renderBillDetails = ({
  primary_subject,
  introduced_date,
  house_passage,
  senate_passage,
  enacted,
  active
}) => {
  const $billDetails = document.createElement('div')

  const $header = document.createElement('h2')
  $header.classList.add('center', 'flow-text')
  $header.textContent = 'Bill Details'

  const $card = document.createElement('div')
  $card.classList.add('card')

  const $contentDiv = document.createElement('div')
  $contentDiv.classList.add('card-content', 'primary-text-color')

  const $subject = document.createElement('p')
  $subject.textContent = 'Primary Subject:'

  const $subjectText = document.createElement('span')
  $subjectText.classList.add('right')
  $subjectText.textContent = primary_subject

  $subject.appendChild($subjectText)

  const $introduced = document.createElement('p')
  $introduced.textContent = 'Introduced:'

  const $introducedText = document.createElement('span')
  $introducedText.classList.add('right')
  $introducedText.textContent = introduced_date

  $introduced.appendChild($introducedText)

  const $house = document.createElement('p')
  $house.textContent = 'House Passage:'

  const $houseText = document.createElement('span')
  $houseText.classList.add('right')
  if (house_passage) {
    $houseText.textContent = house_passage
  } else {
    $houseText.appendChild(renderClose())
  }

  $house.appendChild($houseText)

  const $senate = document.createElement('p')
  $senate.textContent = 'Senate Passage:'

  const $senateText = document.createElement('span')
  $senateText.classList.add('right')
  if (senate_passage) {
    $senateText.textContent = senate_passage
  } else {
    $senateText.appendChild(renderClose())
  }

  $senate.appendChild($senateText)

  const $enacted = document.createElement('p')
  $enacted.textContent = 'Enacted:'

  const $enactedText = document.createElement('span')
  $enactedText.classList.add('right')
  if (enacted) {
    $enactedText.appendChild(renderCheck())
  } else {
    $enactedText.appendChild(renderClose())
  }

  $enacted.appendChild($enactedText)

  const $active = document.createElement('p')
  $active.textContent = 'Active:'

  const $activeText = document.createElement('span')
  $activeText.classList.add('right')
  if (active) {
    $activeText.appendChild(renderCheck())
  } else {
    $activeText.appendChild(renderClose())
  }

  $active.appendChild($activeText)

  $billDetails.appendChild($header)
  $billDetails.appendChild($card)
  $card.appendChild($contentDiv)
  $contentDiv.appendChild($subject)
  $contentDiv.appendChild($introduced)
  $contentDiv.appendChild($house)
  $contentDiv.appendChild($senate)
  $contentDiv.appendChild($enacted)
  $contentDiv.appendChild($active)

  return $billDetails
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

const showBill = (location, billId, repId) => {
  const $topRow = document.createElement('div')
  $topRow.classList.add('row')

  const $repRow = document.createElement('div')
  $repRow.classList.add('row')

  const $repDiv = document.createElement('div')
  $repDiv.classList.add('col', 's12', 'l6')

  const $detailsRow = document.createElement('div')
  $detailsRow.classList.add('row')

  const $detailsDiv = document.createElement('div')
  const $conDiv = document.createElement('div')
  $conDiv.classList.add('col', 's12', 'l6')

  const $botRow = document.createElement('div')
  $botRow.classList.add('row')

  getRepById(repId).then(rep => {
    $repRow.appendChild(renderRepBillView(rep))
  })

  getRepCampaign(repId).then(details => {
    $conDiv.appendChild(renderCampaignDetails(details))
  })

  getBill(billId).then(bill => {
    $botRow.appendChild(renderBill(bill))
    $detailsDiv.appendChild(renderBillDetails(bill))
  })

  location.innerHTML = ''
  location.appendChild($topRow)
  $topRow.appendChild($repDiv)
  $repDiv.appendChild($repRow)
  $repDiv.appendChild($detailsRow)
  $detailsRow.appendChild($detailsDiv)
  $topRow.appendChild($conDiv)
  location.appendChild($botRow)
}

/*Initiates page*/

$apella.appendChild(renderHome())

const $findRep = document.querySelector('#find-rep')
const $latestSenate = document.querySelector('#latest-senate')
const $latestHouse = document.querySelector('#latest-house')

$findRep.appendChild(renderSearch())
showLatestBills($latestSenate, 'senate')
showLatestBills($latestHouse, 'house')

/*$latestHouse.appendChild(showLatestBills($latestHouse, 'house'))*/

/* Event listeners*/
window.addEventListener('popstate', function() {
  console.log('fired')
  console.log(location.href)
  if (location.href === 'http://localhost:3000/') {
    $headerMsg.innerHTML = ''
    $apella.innerHTML = ''
    $apella.appendChild(renderHome())

    const $findRep = document.querySelector('#find-rep')
    const $latestSenate = document.querySelector('#latest-senate')
    const $latestHouse = document.querySelector('#latest-house')

    $findRep.appendChild(renderSearch())
    showLatestBills($latestSenate, 'senate')
    showLatestBills($latestHouse, 'house')
  }
})

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

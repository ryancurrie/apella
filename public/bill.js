const $headerMsg = document.querySelector('#header-msg')
const $apella = document.querySelector('#apella')

/*Currency Fromatter */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})

const getBill = billId => {
  return fetch(`/bills/${billId}`).then(results => results.json())
}

const getRepById = id => {
  const url = `/rep/${id}`
  return fetch(url).then(results => results.json())
}

const getRepCampaign = id => {
  const url = `/rep/campaign/${id}`
  return fetch(url).then(results => results.json())
}

const renderBillRep = ({
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
  const $summaryDiv = document.createElement('div')
  const $billContent = document.createElement('div')

  if (content.length > 0) {
    $billContent.innerHTML = `<h5 id="no-content-header" class="flow-text center">${title}</h5><p class="summary">${summary}</p>${content}`
  } else if (summary.length > 0) {
    $bill.innerHTML = `<h5 id="no-content-header" class="flow-text center">${title}</h5><p class="summary">${summary}</p>`
  } else {
    $bill.innerHTML = `<h5 id="no-content-header" class="flow-text center">${title}</h5><p>No text is available for this bill.</p>`
  }

  $bill.appendChild($summaryDiv)
  $bill.appendChild($billContent)

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

const showBill = (billId, repId) => {
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
    $repRow.appendChild(renderBillRep(rep))
  })

  getRepCampaign(repId).then(details => {
    $conDiv.appendChild(renderCampaignDetails(details))
  })

  getBill(billId).then(bill => {
    $botRow.appendChild(renderBill(bill))
    $detailsDiv.appendChild(renderBillDetails(bill))
  })

  $apella.innerHTML = ''
  $apella.appendChild($topRow)
  $topRow.appendChild($repDiv)
  $repDiv.appendChild($repRow)
  $repDiv.appendChild($detailsRow)
  $detailsRow.appendChild($detailsDiv)
  $topRow.appendChild($conDiv)
  $apella.appendChild($botRow)
}

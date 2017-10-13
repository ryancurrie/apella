const $apella = document.querySelector('#apella')
const $findRep = document.querySelector('#find-rep')

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

const renderReps = ({
  value: { chamber, id, first_name, last_name, party, photoUrl, short_title }
}) => {
  const $repCard = document.createElement('div')
  $repCard.classList.add('card', 'horizontal')

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

  const $actionDiv = document.createElement('div')
  $actionDiv.classList.add('card-action')

  const $cardAction = document.createElement('a')
  $cardAction.setAttribute('href', '#')
  $cardAction.setAttribute('class', 'see-bill')
  $cardAction.setAttribute('data-id', `${id}`)
  $cardAction.textContent = 'See Bills'

  $repCard.appendChild($imgDiv)
  $imgDiv.appendChild($img)
  $repCard.appendChild($cardDiv)
  $cardDiv.appendChild($contentDiv)
  $contentDiv.appendChild($chamber)
  $contentDiv.appendChild($repName)
  $cardDiv.appendChild($actionDiv)
  $actionDiv.appendChild($cardAction)

  return $repCard
}

$findRep.appendChild(renderSearch())

const getReps = query => {
  console.log(query)
  console.log(typeof query)
  const url = `/get-reps/${query}`
  console.log(url)
  console.log(typeof url)
  return fetch(url).then(results => results.json())
}

const showReps = (location, query) => {
  console.log(query)
  console.log(typeof query)
  getReps(query).then(reps => {
    console.log(reps)
    location.innerHTML = ''

    reps
      .map(rep => renderReps(rep))
      .forEach($repCard => location.appendChild($repCard))
  })
}

const $searchButton = document.querySelector('#zip-search-button')

$searchButton.addEventListener('click', event => {
  event.preventDefault()
  const $entry = document.querySelector('#zip-code').value

  if ($entry.length !== 5) {
    Materialize.toast('Please enter a valid ZIP code', 4000)
  } else {
    showReps($apella, $entry)
  }
})

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
  $zipLable.textContent = 'ZIP codes'

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

$findRep.appendChild(renderSearch())

const $searchButton = document.querySelector('#zip-search-button')

$searchButton.addEventListener('click', event => {
  event.preventDefault()
  const search = document.querySelector('#zip-code').value

  if (search.length !== 5) {
    Materialize.toast('Please enter a valid ZIP code', 4000)
  } else {
    fetch(`/get-reps/${search}`).then(results => {
      return results.json()
    })
  }
})

import './winList.scss'
import store from '../../store'

const renderWinList = () => {
  const size = store.getSize()
  const div = document.createElement('div')
  div.className = 'winList'
  div.innerHTML = `
    <div class="winList__panel">
      <div class="winList__close-btn">Close</div>
    </div>
    <div class="winList__title">Win list ${size}x${size}</div>
    <div class="winList__head">
      <div class="winList__item">name</div>
      <div class="winList__item">time</div>
      <div class="winList__item">moves</div>
    </div>`
  const winListSize = store.getWinList()
  winListSize.forEach((elem) => {
    const item = document.createElement('div')
    item.className = 'winList__row'
    item.innerHTML = `
      <div class="winList__item">${elem.name}</div>
      <div class="winList__item">${elem.time}</div>
      <div class="winList__item">${elem.moves}</div>
    `
    div.append(item)
  })
  div.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.winList').remove()
  })
  return div
}

export function showWinList() {
  document.body.append(renderWinList())
}

export default renderWinList

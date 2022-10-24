import './sizePanel.scss'
import html from './sizePanel.html'
import store from '../../store'
import { createWinFieldArr, shuffleMatrix } from '../../helpers'

import { visibleMoves } from '../infoPanel/infoPanel'

const sizePanel = () => {
  const div = document.createElement('div')
  div.className = 'sizePanel'
  div.innerHTML = html

  div.addEventListener('click', (e) => {
    e.preventDefault()
    const { size } = e.target.dataset
    if (size !== undefined) {
      document.querySelector('.sizePanel__size').innerHTML = `${size}X${size}`
      document.querySelector('.buttonsPanel__stop').disabled = true
      store.setSize(size)
      store.setTimeStart(null)
      visibleMoves(0)
      store.setField(shuffleMatrix(store.getSize()))
      store.setWinField(createWinFieldArr(size))
    }
  })

  return div
}

export default sizePanel

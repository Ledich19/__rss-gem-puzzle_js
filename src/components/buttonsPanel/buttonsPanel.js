import './buttonsPanel.scss'
import html from './buttonsPanel.html'
import store from '../../store'
import { shuffleMatrix } from '../../helpers'
import { visibleMoves } from '../infoPanel/infoPanel'
import { showWinList } from '../winList/winList'

const handleShuffle = () => {
  document.querySelector('.buttonsPanel__stop').disabled = false
  store.setField(shuffleMatrix(store.getSize()))
  store.setTimeStart(Date.now())
  visibleMoves(0)
}
const handleSave = () => {
  const rssGemPuzzleSaveObject = {
    dataPosition: store.getField(),
    gameTime: store.getTimeStart() ? (Date.now() - store.getTimeStart()) : null,
    moves: store.getMoves(),
    size: store.getSize(),
    winField: store.getWinField(),
  }
  localStorage.setItem('rssGemPuzzleSaveObject', JSON.stringify(rssGemPuzzleSaveObject))
}
const handleResults = () => {
  showWinList()
}
const handleAudio = (e) => {
  if (store.getAudio()) {
    store.setAudio(false)
    e.style.background = '#e69096'
    e.innerHTML = '<img src="./assets/icons/volume-mute2.svg"/>'
  } else {
    store.setAudio(true)
    e.style.background = '#90e690'
    e.innerHTML = '<img src="./assets/icons/volume-high.svg"/>'
  }
}
export const handlerStop = () => {
  document.querySelector('.buttonsPanel__stop').disabled = true
  store.setTimeStart(null)
  visibleMoves(0)
}

const buttonsPanel = () => {
  const div = document.createElement('div')
  div.className = 'buttonsPanel'
  div.innerHTML = html
  div.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.dataset.shuffle !== undefined) {
      handleShuffle()
    } else if (e.target.dataset.stop !== undefined) {
      handlerStop()
    } else if (e.target.dataset.save !== undefined) {
      handleSave()
    } else if (e.target.dataset.results !== undefined) {
      handleResults()
    } else if (e.target.closest('button').dataset.audio !== undefined) {
      handleAudio(e.target.closest('button'))
    }
  })

  return div
}

export default buttonsPanel

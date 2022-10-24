import './infoPanel.scss'
import html from './infoPanel.html'
import store from '../../store'
import { getTimePast } from '../../helpers'

const infoPanel = () => {
  const div = document.createElement('div')
  div.className = 'infoPanel'
  div.innerHTML = html
  return div
}

export const visibleMoves = (num) => {
  const infoPanelMovesValue = document.querySelector('.infoPanel__moves-value')
  store.setMoves(num)
  infoPanelMovesValue.innerHTML = store.getMoves()
}

function updateClock() {
  const timesValue = document.querySelector('.infoPanel__times-value')
  const timeStart = store.getTimeStart()
  timesValue.innerHTML = getTimePast(timeStart)
}
export function startTimer() {
  setInterval(updateClock, 1000)
}

export default infoPanel

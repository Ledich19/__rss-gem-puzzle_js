import container from './components/container/container'
import { fieldHandler } from './components/field/field'
import { startTimer, visibleMoves } from './components/infoPanel/infoPanel'
import { shuffleMatrix } from './helpers'
import store from './store'

document.body.append(container())
fieldHandler()
startTimer()
store.setTimeStart(null)
store.setField(shuffleMatrix(store.getSize()))

const save = localStorage.getItem('rssGemPuzzleSaveObject')
if (save) {
  const answer = window.confirm('Хотите продолжить сохраненную игру? При отказе игра будет удалена')
  if (answer) {
    const saveObj = JSON.parse(save)
    store.setField(saveObj.dataPosition)

    visibleMoves(saveObj.moves)
    store.setWinField(saveObj.winField)
    store.setTimeStart(saveObj.gameTime ? Date.now() - saveObj.gameTime : null)
    store.setSize(saveObj.size)
  } else {
    localStorage.removeItem('rssGemPuzzleSaveObject')
  }
}
const winList = localStorage.getItem('setWinListSaveObject')
if (winList) {
  const saveObj = JSON.parse(winList)
  store.setWinList(saveObj)
}
